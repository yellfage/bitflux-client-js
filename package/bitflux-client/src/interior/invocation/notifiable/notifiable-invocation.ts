import { AbortError } from '../../../abort-error'

import type {
  Invocation,
  RetryControl,
  RetryDelayScheme,
} from '../../../invocation'

import type { Bridge } from '../../communication'

import { OutgoingNotifiableInvocationMessage } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
  RetryEventChannel,
  RetryEventFactory,
} from '../../event'

export class NotifiableInvocation implements Invocation {
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
  }

  public async perform(): Promise<void> {
    if (this.abortController.signal.aborted) {
      throw new Error('The provided AbortController is already aborted')
    }

    const invocationEvent = this.inquiryEventFactory.create(this)

    await this.inquiry.emit(invocationEvent)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.abortController.signal.aborted) {
      throw new AbortError('The invocation has been aborted')
    }

    this.bridge.send(
      new OutgoingNotifiableInvocationMessage(this.handlerName, this.args),
    )
  }
}
