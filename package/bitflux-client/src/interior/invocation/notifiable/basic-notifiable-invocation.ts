import type { Bridge } from '../../communication'

import { OutgoingNotifiableInvocationMessage } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
} from '../../event'

import type { NotifiableInvocation } from './notifiable-invocation'

import type { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class BasicNotifiableInvocation implements NotifiableInvocation {
  public readonly shape: NotifiableInvocationShape

  public readonly inquiry: InquiryEventChannel

  public readonly reply: ReplyEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly bridge: Bridge

  public constructor(
    shape: NotifiableInvocationShape,
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    bridge: Bridge,
  ) {
    this.shape = shape
    this.inquiry = inquiryEventChannel
    this.reply = replyEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.bridge = bridge
  }

  public async perform(): Promise<void> {
    const invocationEvent = this.inquiryEventFactory.create(this)

    await this.inquiry.emit(invocationEvent)

    this.bridge.send(
      new OutgoingNotifiableInvocationMessage(
        this.shape.handlerName,
        this.shape.args,
      ),
    )
  }
}
