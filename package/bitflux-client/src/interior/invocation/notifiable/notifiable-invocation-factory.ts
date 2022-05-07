import type {
  Invocation,
  RetryControl,
  RetryDelayScheme,
} from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
  RetryEventChannel,
  RetryEventFactory,
} from '../../event'

import type { InvocationFactory } from '../invocation-factory'

import { NotifiableInvocation } from './notifiable-invocation'

export class NotifiableInvocationFactory implements InvocationFactory {
  private readonly handlerName: string

  private readonly args: unknown[]

  public constructor(handlerName: string, args: unknown[]) {
    this.handlerName = handlerName
    this.args = args
  }

  public create(
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
  ): Invocation {
    return new NotifiableInvocation(
      this.handlerName,
      this.args,
      inquiryEventChannel,
      replyEventChannel,
      retryEventChannel,
      abortController,
      inquiryEventFactory,
      replyEventFactory,
      retryEventFactory,
      bridge,
      rejectionDelay,
      attempRejectionDelay,
      retryControl,
      retryDelayScheme,
    )
  }
}
