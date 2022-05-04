import type { RegularInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
} from '../../event'

import { BasicRegularInvocationBuilder } from './basic-regular-invocation-builder'

import type { RegularInvocationBuilderFactory } from './regular-invocation-builder-factory'

export class BasicRegularInvocationBuilderFactory
  implements RegularInvocationBuilderFactory
{
  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  private readonly inquiryEventChannel: InquiryEventChannel

  private readonly replyEventChannel: ReplyEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly replyEventFactory: ReplyEventFactory

  private readonly bridge: Bridge

  public constructor(
    rejectionDelay: number,
    attempRejectionDelay: number,
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    bridge: Bridge,
  ) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attempRejectionDelay
    this.inquiryEventChannel = inquiryEventChannel
    this.replyEventChannel = replyEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.replyEventFactory = replyEventFactory
    this.bridge = bridge
  }

  public create<TResult>(
    handlerName: string,
  ): RegularInvocationBuilder<TResult> {
    return new BasicRegularInvocationBuilder(
      handlerName,
      this.rejectionDelay,
      this.attemptRejectionDelay,
      this.inquiryEventChannel,
      this.replyEventChannel,
      this.inquiryEventFactory,
      this.replyEventFactory,
      this.bridge,
    )
  }
}
