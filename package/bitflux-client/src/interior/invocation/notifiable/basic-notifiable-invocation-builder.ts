import type { NotifiableInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
} from '../../event'

import { BasicNotifiableInvocation } from './basic-notifiable-invocation'

export class BasicNotifiableInvocationBuilder
  implements NotifiableInvocationBuilder
{
  private readonly handlerName: string

  private args: unknown[] = []

  private readonly inquiryEventChannel: InquiryEventChannel

  private readonly replyEventChannel: ReplyEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly bridge: Bridge

  public constructor(
    handlerName: string,
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    bridge: Bridge,
  ) {
    this.handlerName = handlerName
    this.inquiryEventChannel = inquiryEventChannel
    this.replyEventChannel = replyEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.bridge = bridge
  }

  public setArgs(...args: unknown[]): this {
    this.args = args

    return this
  }

  public perform(): Promise<void> {
    return new BasicNotifiableInvocation(
      {
        handlerName: this.handlerName,
        args: this.args,
      },
      this.inquiryEventChannel,
      this.replyEventChannel,
      this.inquiryEventFactory,
      this.bridge,
    ).perform()
  }
}
