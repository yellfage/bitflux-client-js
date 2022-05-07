import type { Invocation } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
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
    abortController: AbortController,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    bridge: Bridge,
    rejectionDelay: number,
    attempRejectionDelay: number,
  ): Invocation {
    return new NotifiableInvocation(
      this.handlerName,
      this.args,
      inquiryEventChannel,
      replyEventChannel,
      abortController,
      inquiryEventFactory,
      replyEventFactory,
      bridge,
      rejectionDelay,
      attempRejectionDelay,
    )
  }
}
