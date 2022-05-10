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

import { RegularInvocation } from './regular-invocation'

export class RegularInvocationFactory implements InvocationFactory {
  private readonly handlerName: string

  private readonly args: unknown[]

  public constructor(handlerName: string, args: unknown[]) {
    this.handlerName = handlerName
    this.args = args
  }

  public create(
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
    return new RegularInvocation(
      this.handlerName,
      this.args,
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
