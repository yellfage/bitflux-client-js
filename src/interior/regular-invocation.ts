import { nanoid } from 'nanoid'

import {
  WebSocketClient,
  WebSocketMessageEvent,
  OutgoingRegularInvocationMessage,
  IncomingSuccessfulRegularInvocationResultMessage,
  IncomingFailedRegularInvocationResultMessage,
  IncomingRegularInvocationResultMessage
} from './communication'

import { RegularInvocationShape } from './regular-invocation-shape'
import { DeferredPromise } from './deferred-promise'

import { IncomingMessage, IncomingMessageType } from '../communication'
import { InvocationAbortedError } from '../invocation-aborted-error'

export class RegularInvocation {
  private readonly webSocket: WebSocketClient
  private readonly shape: RegularInvocationShape
  private readonly message: OutgoingRegularInvocationMessage
  private readonly deferredPromise: DeferredPromise<any>
  private rejectionTimeoutId: number
  private attemptRejectionTimeoutId: number

  public constructor(
    webSocket: WebSocketClient,
    shape: RegularInvocationShape
  ) {
    this.webSocket = webSocket
    this.shape = shape

    this.message = new OutgoingRegularInvocationMessage(
      shape.handlerName,
      shape.args,
      nanoid()
    )

    this.deferredPromise = new DeferredPromise()
    this.rejectionTimeoutId = 0
    this.attemptRejectionTimeoutId = 0
  }

  public perform(): Promise<any> {
    if (this.shape.abortController.signal.aborted) {
      throw new Error(
        'Unable to perform regular invocation: the provided AbortController is already aborted'
      )
    }

    this.registerWebSocketHandlers()

    this.registerAbortionHandler()

    this.runRejectionTimeout()

    this.sendMessage()

    return this.deferredPromise.promise
  }

  private registerWebSocketHandlers(): void {
    this.webSocket.on('disconnected', this.handleDisconnect)
    this.webSocket.on('connected', this.handleConnect)
    this.webSocket.on('terminating', this.handleTerminating)
    this.webSocket.on('message', this.handleMessage)
  }

  private unregisterWebSocketHandlers(): void {
    this.webSocket.off('disconnected', this.handleDisconnect)
    this.webSocket.off('connected', this.handleConnect)
    this.webSocket.off('terminating', this.handleTerminating)
    this.webSocket.off('message', this.handleMessage)
  }

  private registerAbortionHandler(): void {
    this.shape.abortController.signal.addEventListener(
      'abort',
      this.handleAbortion
    )
  }

  private unregisterAbortionHandler(): void {
    this.shape.abortController.signal.removeEventListener(
      'abort',
      this.handleAbortion
    )
  }

  private runRejectionTimeout(): void {
    const { rejectionDelay } = this.shape

    if (rejectionDelay <= 0) {
      return
    }

    this.rejectionTimeoutId = setTimeout(() => {
      this.handleResult(
        new InvocationAbortedError('The invocation aborted: timeout')
      )
    }, rejectionDelay) as unknown as number
  }

  private runAttemptRejectionTimeout(): void {
    const { attemptRejectionDelay } = this.shape

    if (attemptRejectionDelay <= 0) {
      return
    }

    this.attemptRejectionTimeoutId = setTimeout(() => {
      this.handleResult(
        new InvocationAbortedError('The invocation aborted: attempt timeout')
      )
    }, attemptRejectionDelay) as unknown as number
  }

  private clearRejectionTimeout(): void {
    clearTimeout(this.rejectionTimeoutId)
  }

  private clearAttemptRejectionTimeout(): void {
    clearTimeout(this.attemptRejectionTimeoutId)
  }

  private sendMessage(): void {
    this.webSocket.send(this.message)

    this.runAttemptRejectionTimeout()
  }

  private handleResult = (result: any): void => {
    this.clearRejectionTimeout()
    this.clearAttemptRejectionTimeout()

    this.unregisterWebSocketHandlers()
    this.unregisterAbortionHandler()

    if (result instanceof Error) {
      this.deferredPromise.reject(result)
    } else {
      this.deferredPromise.resolve(result)
    }
  }

  private handleAbortion = (): void => {
    this.handleResult(
      new InvocationAbortedError('The invocation aborted: manual abortion')
    )
  }

  private handleTerminating = (): void => {
    this.handleResult(
      new InvocationAbortedError('The invocation aborted: termination')
    )
  }

  private handleDisconnect = (): void => {
    this.clearAttemptRejectionTimeout()
  }

  private handleConnect = (): void => {
    this.sendMessage()
  }

  private handleMessage = ({
    data: message
  }: WebSocketMessageEvent<IncomingMessage>): void => {
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
    message: IncomingMessage
  ): message is IncomingRegularInvocationResultMessage {
    return (
      this.isSuccessfulRegularInvocationResultMessage(message) ||
      this.isFailedRegularInvocationResultMessage(message)
    )
  }

  private isSuccessfulRegularInvocationResultMessage(
    message: IncomingMessage
  ): message is IncomingSuccessfulRegularInvocationResultMessage {
    return (
      message.type === IncomingMessageType.SuccessfulRegularInvocationResult
    )
  }

  private isFailedRegularInvocationResultMessage(
    message: IncomingMessage
  ): message is IncomingFailedRegularInvocationResultMessage {
    return message.type === IncomingMessageType.FailedRegularInvocationResult
  }

  private isInvocationIdMatching(
    message: IncomingRegularInvocationResultMessage
  ): boolean {
    return this.message.invocationId === message.invocationId
  }
}
