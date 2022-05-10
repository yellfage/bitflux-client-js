import type { Invocation } from '../../invocation'

import type { Items } from '../../items'

import type { RetryControl, RetryDelayScheme } from '../../retry'

import type { Bridge } from '../communication'

import type {
  InvocatingEventChannel,
  InvocatingEventFactory,
  ReplyingEventChannel,
  ReplyingEventFactory,
  RetryingEventChannel,
  RetryingEventFactory,
} from '../event'

export interface InvocationFactory {
  create(
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
  ): Invocation
}
