import type { InvocationBuilder } from '../../invocation'

import type { InvocationPluginBuilder } from '../../plugin'

import type { Bridge } from '../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
} from '../event'

import type { InvocationFactory } from './invocation-factory'

export class BasicInvocationBuilder<TResult>
  implements InvocationBuilder<TResult>
{
  private readonly invocationFactory: InvocationFactory

  private readonly inquiryEventChannel: InquiryEventChannel

  private readonly replyEventChannel: ReplyEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly replyEventFactory: ReplyEventFactory

  private readonly bridge: Bridge

  private abortController: AbortController

  private rejectionDelay: number

  private attemptRejectionDelay: number

  private readonly pluginBuilders: InvocationPluginBuilder[] = []

  public constructor(
    invocationFactory: InvocationFactory,
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    bridge: Bridge,
    abortController: AbortController,
    rejectionDelay: number,
    attempRejectionDelay: number,
  ) {
    this.invocationFactory = invocationFactory
    this.inquiryEventChannel = inquiryEventChannel
    this.replyEventChannel = replyEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.replyEventFactory = replyEventFactory
    this.bridge = bridge
    this.abortController = abortController
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attempRejectionDelay
  }

  public use(builder: InvocationPluginBuilder): this {
    this.pluginBuilders.push(builder)

    return this
  }

  public setAbortController(controller: AbortController): this {
    this.abortController = controller

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

  public async perform(): Promise<TResult> {
    const invocation = this.invocationFactory.create(
      this.inquiryEventChannel,
      this.replyEventChannel,
      this.abortController,
      this.inquiryEventFactory,
      this.replyEventFactory,
      this.bridge,
      this.rejectionDelay,
      this.attemptRejectionDelay,
    )

    this.pluginBuilders
      .map((builder) => builder.build())
      .forEach((plugin) => plugin.initialize(invocation))

    const result = await invocation.perform()

    return result as TResult
  }
}
