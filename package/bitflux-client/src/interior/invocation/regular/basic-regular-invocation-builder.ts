import { nanoid } from 'nanoid'

import type { RegularInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
} from '../../event'

import { BasicRegularInvocation } from './basic-regular-invocation'

export class BasicRegularInvocationBuilder<TResult>
  implements RegularInvocationBuilder<TResult>
{
  private readonly handlerName: string

  private args: unknown[] = []

  private abortController = new AbortController()

  private rejectionDelay: number

  private attemptRejectionDelay: number

  private readonly inquiryEventChannel: InquiryEventChannel

  private readonly replyEventChannel: ReplyEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly replyEventFactory: ReplyEventFactory

  private readonly bridge: Bridge

  public constructor(
    handlerName: string,
    defaultRejectionDelay: number,
    defaultAttempRejectionDelay: number,
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    bridge: Bridge,
  ) {
    this.handlerName = handlerName
    this.rejectionDelay = defaultRejectionDelay
    this.attemptRejectionDelay = defaultAttempRejectionDelay
    this.inquiryEventChannel = inquiryEventChannel
    this.replyEventChannel = replyEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.replyEventFactory = replyEventFactory
    this.bridge = bridge
  }

  public setArgs(...args: unknown[]): this {
    this.args = args

    return this
  }

  public setRejectionDelay(delay: number): this {
    this.rejectionDelay = delay

    return this
  }

  public setAttemptRejectionDelay(delay: number): this {
    this.attemptRejectionDelay = delay

    return this
  }

  public setAbortController(controller: AbortController): this {
    this.abortController = controller

    return this
  }

  public perform(): Promise<TResult> {
    return new BasicRegularInvocation<TResult>(
      {
        handlerName: this.handlerName,
        args: this.args,
        id: nanoid(),
        rejectionDelay: this.rejectionDelay,
        attemptRejectionDelay: this.attemptRejectionDelay,
        abortController: this.abortController,
      },
      this.inquiryEventChannel,
      this.replyEventChannel,
      this.inquiryEventFactory,
      this.replyEventFactory,
      this.bridge,
    ).perform()
  }
}
