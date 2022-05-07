import type { InvocationBuilder } from '../../invocation'

import type { Bridge } from '../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
} from '../event'

import { BasicInvocationBuilder } from './basic-invocation-builder'

import type { InvocationBuilderFactory } from './invocation-builder-factory'

import type { InvocationFactory } from './invocation-factory'

export class BasicInvocationBuilderFactory implements InvocationBuilderFactory {
  private readonly inquiryEventChannel: InquiryEventChannel

  private readonly replyEventChannel: ReplyEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly replyEventFactory: ReplyEventFactory

  private readonly bridge: Bridge

  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  public constructor(
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    bridge: Bridge,
    rejectionDelay: number,
    attempRejectionDelay: number,
  ) {
    this.inquiryEventChannel = inquiryEventChannel
    this.replyEventChannel = replyEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.replyEventFactory = replyEventFactory
    this.bridge = bridge
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attempRejectionDelay
  }

  public create<TResult>(
    invocationFactory: InvocationFactory,
  ): InvocationBuilder<TResult> {
    return new BasicInvocationBuilder(
      invocationFactory,
      this.inquiryEventChannel.clone(),
      this.replyEventChannel.clone(),
      this.inquiryEventFactory,
      this.replyEventFactory,
      this.bridge,
      new AbortController(),
      this.rejectionDelay,
      this.attemptRejectionDelay,
    )
  }
}
