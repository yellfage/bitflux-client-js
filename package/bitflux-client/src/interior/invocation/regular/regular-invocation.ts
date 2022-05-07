import { nanoid } from 'nanoid'

import { AbortError } from '../../../abort-error'

import type { IncomingMessage } from '../../../communication'

import { IncomingMessageType } from '../../../communication'

import type { Invocation } from '../../../invocation'

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
} from '../../event'

export class RegularInvocation implements Invocation {
  public readonly handlerName: string

  public readonly args: unknown[]

  public readonly inquiry: InquiryEventChannel

  public readonly reply: ReplyEventChannel

  public readonly abortController: AbortController

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly replyEventFactory: ReplyEventFactory

  private readonly bridge: Bridge

  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  private readonly message: OutgoingRegularInvocationMessage

  private readonly deferredPromise = new DeferredPromise()

  private rejectionTimeoutId = 0

  private attemptRejectionTimeoutId = 0

  public constructor(
    handlerName: string,
    args: unknown[],
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    abortController: AbortController,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    bridge: Bridge,
    rejectionDelay: number,
    attemptRejectionDelay: number,
  ) {
    this.handlerName = handlerName
    this.args = args
    this.inquiry = inquiryEventChannel
    this.reply = replyEventChannel
    this.abortController = abortController
    this.inquiryEventFactory = inquiryEventFactory
    this.replyEventFactory = replyEventFactory
    this.bridge = bridge
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay

    this.message = new OutgoingRegularInvocationMessage(
      nanoid(),
      handlerName,
      args,
    )
  }

  public async perform(): Promise<unknown> {
    if (this.abortController.signal.aborted) {
      throw new Error('The provided AbortController is already aborted')
    }

    this.registerEventHandlers()

    this.registerAbortEventHandler()

    this.runRejectionTimeout()

    const inquiryEvent = this.inquiryEventFactory.create(this)

    await this.inquiry.emit(inquiryEvent)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.abortController.signal.aborted) {
      throw new AbortError('The regular invocation has been aborted')
    }

    this.sendMessage()

    const result = await this.deferredPromise.promise

    const replyEvent = this.replyEventFactory.create(this, result)

    await this.reply.emit(replyEvent)

    return replyEvent.result
  }

  private registerEventHandlers(): void {
    this.bridge.connected.add(this.handleConnectedEvent)
    this.bridge.disconnecting.add(this.handleDisconnectingEvent)
    this.bridge.disconnected.add(this.handleDisconnectedEvent)
    this.bridge.message.add(this.handleMessageEvent)
  }

  private unregisterEventHandlers(): void {
    this.bridge.connected.remove(this.handleConnectedEvent)
    this.bridge.disconnecting.remove(this.handleDisconnectingEvent)
    this.bridge.disconnected.remove(this.handleDisconnectedEvent)
    this.bridge.message.remove(this.handleMessageEvent)
  }

  private registerAbortEventHandler(): void {
    this.abortController.signal.addEventListener('abort', this.handleAbortEvent)
  }

  private unregisterAbortEventHandler(): void {
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

    this.runAttemptRejectionTimeout()
  }

  private readonly handleResult = (result: unknown): void => {
    this.clearRejectionTimeout()
    this.clearAttemptRejectionTimeout()

    this.unregisterEventHandlers()
    this.unregisterAbortEventHandler()

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
