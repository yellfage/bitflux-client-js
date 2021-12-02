import { AbortError } from '../../abort-error'

import type { IncomingMessage } from '../../communication'

import { IncomingMessageType } from '../../communication'

import type {
  Bridge,
  BridgeMessageEvent,
  IncomingFailedRegularInvocationResultMessage,
  IncomingRegularInvocationResultMessage,
  IncomingSuccessfulRegularInvocationResultMessage,
} from '../communication'

import { OutgoingRegularInvocationMessage } from '../communication'

import { DeferredPromise } from '../deferred-promise'

import type { RegularInvocation } from './regular-invocation'

import type { RegularInvocationShape } from './regular-invocation-shape'

export class BasicRegularInvocation<TResult>
  implements RegularInvocation<TResult>
{
  private readonly bridge: Bridge

  private readonly shape: RegularInvocationShape

  private readonly message: OutgoingRegularInvocationMessage

  private readonly deferredPromise = new DeferredPromise<TResult>()

  private rejectionTimeoutId = 0

  private attemptRejectionTimeoutId = 0

  public constructor(bridge: Bridge, shape: RegularInvocationShape) {
    this.bridge = bridge
    this.shape = shape

    this.message = new OutgoingRegularInvocationMessage(
      shape.id,
      shape.handlerName,
      shape.args,
    )
  }

  public async perform(): Promise<TResult> {
    if (this.shape.abortController.signal.aborted) {
      throw new Error(
        'Unable to perform regular invocation: the provided AbortController is already aborted',
      )
    }

    this.registerBridgeEventHandlers()

    this.registerAbortionHandler()

    this.runRejectionTimeout()

    this.sendMessage()

    return this.deferredPromise.promise
  }

  private registerBridgeEventHandlers(): void {
    this.bridge.on('disconnected', this.handleDisconnectedEvent)
    this.bridge.on('connected', this.handleConnectedEvent)
    this.bridge.on('terminating', this.handleTerminatingEvent)
    this.bridge.on('message', this.handleMessageEvent)
  }

  private unregisterBridgeEventHandlers(): void {
    this.bridge.off('disconnected', this.handleDisconnectedEvent)
    this.bridge.off('connected', this.handleConnectedEvent)
    this.bridge.off('terminating', this.handleTerminatingEvent)
    this.bridge.off('message', this.handleMessageEvent)
  }

  private registerAbortionHandler(): void {
    this.shape.abortController.signal.addEventListener(
      'abort',
      this.handleAbortion,
    )
  }

  private unregisterAbortionHandler(): void {
    this.shape.abortController.signal.removeEventListener(
      'abort',
      this.handleAbortion,
    )
  }

  private runRejectionTimeout(): void {
    const { rejectionDelay } = this.shape

    if (rejectionDelay <= 0) {
      return
    }

    this.rejectionTimeoutId = setTimeout(() => {
      this.shape.abortController.abort()
    }, rejectionDelay) as unknown as number
  }

  private runAttemptRejectionTimeout(): void {
    const { attemptRejectionDelay } = this.shape

    if (attemptRejectionDelay <= 0) {
      return
    }

    this.attemptRejectionTimeoutId = setTimeout(() => {
      this.shape.abortController.abort()
    }, attemptRejectionDelay) as unknown as number
  }

  private clearRejectionTimeout(): void {
    clearTimeout(this.rejectionTimeoutId)
  }

  private clearAttemptRejectionTimeout(): void {
    clearTimeout(this.attemptRejectionTimeoutId)
  }

  private sendMessage(): void {
    this.bridge.send(this.message)

    this.runAttemptRejectionTimeout()
  }

  private readonly handleResult = (result: unknown): void => {
    this.clearRejectionTimeout()
    this.clearAttemptRejectionTimeout()

    this.unregisterBridgeEventHandlers()
    this.unregisterAbortionHandler()

    if (result instanceof Error) {
      this.deferredPromise.reject(result)
    } else {
      this.deferredPromise.resolve(result as TResult)
    }
  }

  private readonly handleAbortion = (): void => {
    this.handleResult(new AbortError('The invocation aborted'))
  }

  private readonly handleTerminatingEvent = (): void => {
    this.shape.abortController.abort()
  }

  private readonly handleDisconnectedEvent = (): void => {
    this.clearAttemptRejectionTimeout()
  }

  private readonly handleConnectedEvent = (): void => {
    this.sendMessage()
  }

  private readonly handleMessageEvent = ({
    message,
  }: BridgeMessageEvent): void => {
    if (
      !this.isRegularInvocationResultMessage(message) ||
      !this.isInvocationIdMatching(message)
    ) {
      return
    }

    if (this.isSuccessfulRegularInvocationResultMessage(message)) {
      this.handleResult(message.value)
    } else if (this.isFailedRegularInvocationResultMessage(message)) {
      this.handleResult(new Error(message.error))
    }
  }

  private isRegularInvocationResultMessage(
    message: IncomingMessage,
  ): message is IncomingRegularInvocationResultMessage {
    return (
      this.isSuccessfulRegularInvocationResultMessage(message) ||
      this.isFailedRegularInvocationResultMessage(message)
    )
  }

  private isSuccessfulRegularInvocationResultMessage(
    message: IncomingMessage,
  ): message is IncomingSuccessfulRegularInvocationResultMessage {
    return (
      message.type === IncomingMessageType.SuccessfulRegularInvocationResult
    )
  }

  private isFailedRegularInvocationResultMessage(
    message: IncomingMessage,
  ): message is IncomingFailedRegularInvocationResultMessage {
    return message.type === IncomingMessageType.FailedRegularInvocationResult
  }

  private isInvocationIdMatching(
    message: IncomingRegularInvocationResultMessage,
  ): boolean {
    return this.shape.id === message.id
  }
}
