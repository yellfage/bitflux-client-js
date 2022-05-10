import type { InvocationBuilder } from '../../invocation'

import type { RetryControl, RetryDelayScheme } from '../../retry'

import { BasicItems } from '../basic-items'

import type { Bridge } from '../communication'

import type {
  InvocatingEventChannel,
  InvocatingEventFactory,
  ReplyingEventChannel,
  ReplyingEventFactory,
  RetryingEventChannel,
  RetryingEventFactory,
} from '../event'

import { BasicInvocationBuilder } from './basic-invocation-builder'

import type { InvocationBuilderFactory } from './invocation-builder-factory'

import type { InvocationFactory } from './invocation-factory'

export class BasicInvocationBuilderFactory implements InvocationBuilderFactory {
  private readonly invocatingEventChannel: InvocatingEventChannel

  private readonly replyingEventChannel: ReplyingEventChannel

  private readonly retryingEventChannel: RetryingEventChannel

  private readonly invocatingEventFactory: InvocatingEventFactory

  private readonly replyingEventFactory: ReplyingEventFactory

  private readonly retryingEventFactory: RetryingEventFactory

  private readonly bridge: Bridge

  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  private readonly retryControl: RetryControl

  private readonly retryDelayScheme: RetryDelayScheme

  public constructor(
    invocatingEventChannel: InvocatingEventChannel,
    replyingEventChannel: ReplyingEventChannel,
    retryingEventChannel: RetryingEventChannel,
    invocatingEventFactory: InvocatingEventFactory,
    replyingEventFactory: ReplyingEventFactory,
    retryingEventFactory: RetryingEventFactory,
    bridge: Bridge,
    rejectionDelay: number,
    attempRejectionDelay: number,
    retryControl: RetryControl,
    retryDelayScheme: RetryDelayScheme,
  ) {
    this.invocatingEventChannel = invocatingEventChannel
    this.replyingEventChannel = replyingEventChannel
    this.retryingEventChannel = retryingEventChannel
    this.invocatingEventFactory = invocatingEventFactory
    this.replyingEventFactory = replyingEventFactory
    this.retryingEventFactory = retryingEventFactory
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
      this.invocatingEventChannel.clone(),
      this.replyingEventChannel.clone(),
      this.retryingEventChannel.clone(),
      this.invocatingEventFactory,
      this.replyingEventFactory,
      this.retryingEventFactory,
      this.bridge,
      new AbortController(),
      new BasicItems(),
      this.rejectionDelay,
      this.attemptRejectionDelay,
      this.retryControl.clone(),
      this.retryDelayScheme.clone(),
    )
  }
}
