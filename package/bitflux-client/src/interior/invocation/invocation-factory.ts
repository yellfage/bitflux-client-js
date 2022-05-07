import type {
  Invocation,
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

export interface InvocationFactory {
  create(
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    retryEventChannel: RetryEventChannel,
    abortController: AbortController,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    retryEventFactory: RetryEventFactory,
    bridge: Bridge,
    rejectionDelay: number,
    attempRejectionDelay: number,
    retryControl: RetryControl,
    retryDelayScheme: RetryDelayScheme,
  ): Invocation
}
