import { AbortError } from '../../../abort-error'

import type { Invocation } from '../../../invocation'

import type { Bridge } from '../../communication'

import { OutgoingNotifiableInvocationMessage } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
} from '../../event'

export class NotifiableInvocation implements Invocation {
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
  }

  public async perform(): Promise<void> {
    if (this.abortController.signal.aborted) {
      throw new Error('The provided AbortController is already aborted')
    }

    const invocationEvent = this.inquiryEventFactory.create(this)

    await this.inquiry.emit(invocationEvent)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.abortController.signal.aborted) {
      throw new AbortError('The notifiable invocation has been aborted')
    }

    this.bridge.send(
      new OutgoingNotifiableInvocationMessage(this.handlerName, this.args),
    )
  }
}
