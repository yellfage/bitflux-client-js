import type { NotifiableInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
} from '../../event'

import { BasicNotifiableInvocationBuilder } from './basic-notifiable-invocation-builder'

import type { NotifiableInvocationBuilderFactory } from './notifiable-invocation-builder-factory'

export class BasicNotifiableInvocationBuilderFactory
  implements NotifiableInvocationBuilderFactory
{
  private readonly inquiryEventChannel: InquiryEventChannel

  private readonly replyEventChannel: ReplyEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly bridge: Bridge

  public constructor(
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    bridge: Bridge,
  ) {
    this.inquiryEventChannel = inquiryEventChannel
    this.replyEventChannel = replyEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.bridge = bridge
  }

  public create(handlerName: string): NotifiableInvocationBuilder {
    return new BasicNotifiableInvocationBuilder(
      handlerName,
      this.inquiryEventChannel,
      this.replyEventChannel,
      this.inquiryEventFactory,
      this.bridge,
    )
  }
}
