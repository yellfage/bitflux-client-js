import type {
  InvocationBuilder,
  RetryControl,
  RetryControlBuilder,
  RetryDelayScheme,
  RetryDelaySchemeBuilder,
} from '../../invocation'

import type { InvocationPluginBuilder } from '../../plugin'

import type { Bridge } from '../communication'

import type {
  InquiryEventChannel,
  InquiryEventFactory,
  ReplyEventChannel,
  ReplyEventFactory,
  RetryEventChannel,
  RetryEventFactory,
} from '../event'

import type { InvocationFactory } from './invocation-factory'

export class BasicInvocationBuilder<TResult>
  implements InvocationBuilder<TResult>
{
  private readonly invocationFactory: InvocationFactory

  private readonly inquiryEventChannel: InquiryEventChannel

  private readonly replyEventChannel: ReplyEventChannel

  private readonly retryEventChannel: RetryEventChannel

  private readonly inquiryEventFactory: InquiryEventFactory

  private readonly replyEventFactory: ReplyEventFactory

  private readonly retryEventFactory: RetryEventFactory

  private readonly bridge: Bridge

  private abortController: AbortController

  private rejectionDelay: number

  private attemptRejectionDelay: number

  private retryControl: RetryControl

  private retryDelayScheme: RetryDelayScheme

  private readonly pluginBuilders: InvocationPluginBuilder[] = []

  public constructor(
    invocationFactory: InvocationFactory,
    inquiryEventChannel: InquiryEventChannel,
    replyEventChannel: ReplyEventChannel,
    retryEventChannel: RetryEventChannel,
    inquiryEventFactory: InquiryEventFactory,
    replyEventFactory: ReplyEventFactory,
    retryEventFactory: RetryEventFactory,
    bridge: Bridge,
    abortController: AbortController,
    rejectionDelay: number,
    attempRejectionDelay: number,
    retryControl: RetryControl,
    retryDelayScheme: RetryDelayScheme,
  ) {
    this.invocationFactory = invocationFactory
    this.inquiryEventChannel = inquiryEventChannel
    this.replyEventChannel = replyEventChannel
    this.retryEventChannel = retryEventChannel
    this.inquiryEventFactory = inquiryEventFactory
    this.replyEventFactory = replyEventFactory
    this.retryEventFactory = retryEventFactory
    this.bridge = bridge
    this.abortController = abortController
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attempRejectionDelay
    this.retryControl = retryControl
    this.retryDelayScheme = retryDelayScheme
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

  public setRetryControl(builder: RetryControlBuilder): this {
    this.retryControl = builder.build()

    return this
  }

  public setRetryDelayScheme(builder: RetryDelaySchemeBuilder): this {
    this.retryDelayScheme = builder.build()

    return this
  }

  public async perform(): Promise<TResult> {
    const invocation = this.invocationFactory.create(
      this.inquiryEventChannel,
      this.replyEventChannel,
      this.retryEventChannel,
      this.abortController,
      this.inquiryEventFactory,
      this.replyEventFactory,
      this.retryEventFactory,
      this.bridge,
      this.rejectionDelay,
      this.attemptRejectionDelay,
      this.retryControl,
      this.retryDelayScheme,
    )

    this.pluginBuilders
      .map((builder) => builder.build())
      .forEach((plugin) => plugin.initialize(invocation))

    const result = await invocation.perform()

    return result as TResult
  }
}
