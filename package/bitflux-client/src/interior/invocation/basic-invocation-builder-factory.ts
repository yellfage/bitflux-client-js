import type {
  InvocationBuilder,
  RetryControl,
  RetryDelayScheme,
} from '../../invocation'

import type { Bridge } from '../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
  RetryEventChannel,
  RetryEventFactory,
} from '../event'

import { BasicInvocationBuilder } from './basic-invocation-builder'

import type { InvocationBuilderFactory } from './invocation-builder-factory'

import type { InvocationFactory } from './invocation-factory'

export class BasicInvocationBuilderFactory implements InvocationBuilderFactory {
  private readonly inquiryEventChannel: InquiryEventChannel

  private readonly replyEventChannel: ReplyEventChannel

  private readonly retryEventChannel: RetryEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly replyEventFactory: ReplyEventFactory

  private readonly retryEventFactory: RetryEventFactory

  private readonly bridge: Bridge

  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  private readonly retryControl: RetryControl

  private readonly retryDelayScheme: RetryDelayScheme

  public constructor(
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    retryEventChannel: RetryEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    retryEventFactory: RetryEventFactory,
    bridge: Bridge,
    rejectionDelay: number,
    attempRejectionDelay: number,
    retryControl: RetryControl,
    retryDelayScheme: RetryDelayScheme,
  ) {
    this.inquiryEventChannel = inquiryEventChannel
    this.replyEventChannel = replyEventChannel
    this.retryEventChannel = retryEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.replyEventFactory = replyEventFactory
    this.retryEventFactory = retryEventFactory
    this.bridge = bridge
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attempRejectionDelay
    this.retryControl = retryControl
    this.retryDelayScheme = retryDelayScheme
  }

  public create<TResult>(
    invocationFactory: InvocationFactory,
  ): InvocationBuilder<TResult> {
    return new BasicInvocationBuilder(
      invocationFactory,
      this.inquiryEventChannel.clone(),
      this.replyEventChannel.clone(),
      this.retryEventChannel.clone(),
      this.inquiryEventFactory,
      this.replyEventFactory,
      this.retryEventFactory,
      this.bridge,
      new AbortController(),
      this.rejectionDelay,
      this.attemptRejectionDelay,
      this.retryControl.clone(),
      this.retryDelayScheme.clone(),
    )
  }
}
