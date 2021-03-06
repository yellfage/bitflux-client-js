import type { Invocation } from '../../../invocation'

import type { Items } from '../../../items'

import type { RetryControl, RetryDelayScheme } from '../../../retry'

import type { Bridge } from '../../communication'

import type {
  InvocatingEventChannel,
  InvocatingEventFactory,
  ReplyingEventChannel,
  ReplyingEventFactory,
  RetryingEventChannel,
  RetryingEventFactory,
} from '../../event'

import type { InvocationFactory } from '../invocation-factory'

import { NotifiableInvocation } from './notifiable-invocation'

export class NotifiableInvocationFactory implements InvocationFactory {
  private readonly handlerName: string

  public constructor(handlerName: string) {
    this.handlerName = handlerName
  }

  public create(
    args: unknown[],
    abortController: AbortController,
    items: Items,
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
  ): Invocation {
    return new NotifiableInvocation(
      this.handlerName,
      args,
      abortController,
      items,
      invocatingEventChannel,
      replyingEventChannel,
      retryingEventChannel,
      invocatingEventFactory,
      replyingEventFactory,
      retryingEventFactory,
      bridge,
      rejectionDelay,
      attempRejectionDelay,
      retryControl,
      retryDelayScheme,
    )
  }
}
