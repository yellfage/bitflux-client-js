import delay from 'delay'

import { nanoid } from 'nanoid'

import { AbortError } from '../../../abort-error'

import type { IncomingMessage } from '../../../communication'

import { IncomingMessageType } from '../../../communication'

import type {
  Invocation,
  RetryControl,
  RetryDelayScheme,
} from '../../../invocation'

import type {
  Bridge,
  IncomingFailedRegularInvocationResultMessage,
  IncomingRegularInvocationResultMessage,
  IncomingSuccessfulRegularInvocationResultMessage,
  MessageBridgeEvent,
} from '../../communication'

import { OutgoingRegularInvocationMessage } from '../../communication'

import { DeferredPromise } from '../../deferred-promise'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
  RetryEventChannel,
  RetryEventFactory,
} from '../../event'

export class RegularInvocation implements Invocation {
  public readonly handlerName: string

  public readonly args: unknown[]

  public readonly inquiry: InquiryEventChannel

  public readonly reply: ReplyEventChannel

  public readonly retry: RetryEventChannel

  public readonly abortController: AbortController

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly replyEventFactory: ReplyEventFactory

  private readonly retryEventFactory: RetryEventFactory

  private readonly bridge: Bridge

  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  private readonly retryControl: RetryControl

  private readonly retryDelayScheme: RetryDelayScheme

  private readonly message: OutgoingRegularInvocationMessage

  private readonly deferredPromise = new DeferredPromise()

  private rejectionTimeoutId = 0

  private attemptRejectionTimeoutId = 0

  public constructor(
    handlerName: string,
    args: unknown[],
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    retryEventChannel: RetryEventChannel,
    abortController: AbortController,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    retryEventFactory: RetryEventFactory,
    bridge: Bridge,
    rejectionDelay: number,
    attemptRejectionDelay: number,
    retryControl: RetryControl,
    retryDelayScheme: RetryDelayScheme,
  ) {
    this.handlerName = handlerName
    this.args = args
    this.inquiry = inquiryEventChannel
    this.reply = replyEventChannel
    this.retry = retryEventChannel
    this.abortController = abortController
    this.inquiryEventFactory = inquiryEventFactory
    this.replyEventFactory = replyEventFactory
    this.retryEventFactory = retryEventFactory
    this.bridge = bridge
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
    this.retryControl = retryControl
    this.retryDelayScheme = retryDelayScheme

    this.message = new OutgoingRegularInvocationMessage(
      nanoid(),
      handlerName,
      args,
    )
  }

  public async perform(): Promise<unknown> {
    this.ensureAbortControllerValid()

    this.registerEventHandlers()

    this.runRejectionTimeout()

    const inquiryEvent = this.inquiryEventFactory.create(this)

    await this.inquiry.emit(inquiryEvent)

    if (this.abortController.signal.aborted) {
      throw new AbortError('The invocation has been aborted')
    }

    try {
      const result = await this.performAttempt()

      const replyEvent = this.replyEventFactory.create(this, result)

      await this.reply.emit(replyEvent)

      return replyEvent.result
    } finally {
      this.clearRejectionTimeout()

      this.unregisterEventHandlers()
    }
  }

  private async performAttempt(): Promise<unknown> {
    this.sendMessage()

    if (this.bridge.state.isConnected) {
      this.runAttemptRejectionTimeout()
    }

    try {
      const result = await this.deferredPromise.promise

      if (this.retryControl.confirm(result)) {
        return await this.parformRetry()
      }

      return result
    } finally {
      this.clearAttemptRejectionTimeout()
    }
  }

  private async parformRetry(): Promise<unknown> {
    const retryDelay = this.retryDelayScheme.moveNext()

    const event = this.retryEventFactory.create(this, retryDelay)

    await this.retry.emit(event)

    try {
      await delay(retryDelay, {
        signal: this.abortController.signal,
      })
    } catch (error: unknown) {
      if (this.abortController.signal.aborted) {
        throw new AbortError('The invocation aborted while waiting for retry')
      }

      throw error
    }

    return this.performAttempt()
  }

  private ensureAbortControllerValid(): void {
    if (this.abortController.signal.aborted) {
      throw new Error('The provided AbortController is already aborted')
    }
  }

  private registerEventHandlers(): void {
    this.bridge.connected.add(this.handleConnectedEvent)
    this.bridge.disconnecting.add(this.handleDisconnectingEvent)
    this.bridge.disconnected.add(this.handleDisconnectedEvent)
    this.bridge.message.add(this.handleMessageEvent)

    this.abortController.signal.addEventListener('abort', this.handleAbortEvent)
  }

  private unregisterEventHandlers(): void {
    this.bridge.connected.remove(this.handleConnectedEvent)
    this.bridge.disconnecting.remove(this.handleDisconnectingEvent)
    this.bridge.disconnected.remove(this.handleDisconnectedEvent)
    this.bridge.message.remove(this.handleMessageEvent)

    this.abortController.signal.removeEventListener(
      'abort',
      this.handleAbortEvent,
    )
  }

  private runRejectionTimeout(): void {
    if (this.rejectionDelay <= 0) {
      return
    }

    this.rejectionTimeoutId = setTimeout(() => {
      this.abortController.abort()
    }, this.rejectionDelay) as unknown as number
  }

  private runAttemptRejectionTimeout(): void {
    if (this.attemptRejectionDelay <= 0) {
      return
    }

    this.attemptRejectionTimeoutId = setTimeout(() => {
      this.abortController.abort()
    }, this.attemptRejectionDelay) as unknown as number
  }

  private clearRejectionTimeout(): void {
    clearTimeout(this.rejectionTimeoutId)
  }

  private clearAttemptRejectionTimeout(): void {
    clearTimeout(this.attemptRejectionTimeoutId)
  }

  private sendMessage(): void {
    this.bridge.send(this.message)
  }

  private readonly handleResult = (result: unknown): void => {
    if (result instanceof Error) {
      this.deferredPromise.reject(result)
    } else {
      this.deferredPromise.resolve(result)
    }
  }

  private readonly handleAbortEvent = (): void => {
    this.handleResult(new AbortError('The invocation has been aborted'))
  }

  private readonly handleConnectedEvent = (): void => {
    this.sendMessage()

    this.runAttemptRejectionTimeout()
  }

  private readonly handleDisconnectingEvent = (): void => {
    this.abortController.abort()
  }

  private readonly handleDisconnectedEvent = (): void => {
    this.clearAttemptRejectionTimeout()
  }

  private readonly handleMessageEvent = ({
    message,
  }: MessageBridgeEvent): void => {
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
    return this.message.id === message.id
  }
}
