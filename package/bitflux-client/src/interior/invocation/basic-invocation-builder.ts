import type { InvocationBuilder } from '../../invocation'

import type { InvocationPluginBuilder } from '../../plugin'

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

import type { InvocationFactory } from './invocation-factory'

export class BasicInvocationBuilder<TResult>
  implements InvocationBuilder<TResult>
{
  private readonly invocationFactory: InvocationFactory

  private readonly invocatingEventChannel: InvocatingEventChannel

  private readonly replyingEventChannel: ReplyingEventChannel

  private readonly retryingEventChannel: RetryingEventChannel

  private readonly invocatingEventFactory: InvocatingEventFactory

  private readonly replyingEventFactory: ReplyingEventFactory

  private readonly retryingEventFactory: RetryingEventFactory

  private readonly bridge: Bridge

  private readonly pluginBuilders: InvocationPluginBuilder[] = []

  private abortController: AbortController

  private rejectionDelay: number

  private attemptRejectionDelay: number

  private readonly retryControl: RetryControl

  private readonly retryDelayScheme: RetryDelayScheme

  public constructor(
    invocationFactory: InvocationFactory,
    invocatingEventChannel: InvocatingEventChannel,
    replyingEventChannel: ReplyingEventChannel,
    retryingEventChannel: RetryingEventChannel,
    invocatingEventFactory: InvocatingEventFactory,
    replyingEventFactory: ReplyingEventFactory,
    retryingEventFactory: RetryingEventFactory,
    bridge: Bridge,
    abortController: AbortController,
    rejectionDelay: number,
    attempRejectionDelay: number,
    retryControl: RetryControl,
    retryDelayScheme: RetryDelayScheme,
  ) {
    this.invocationFactory = invocationFactory
    this.invocatingEventChannel = invocatingEventChannel
    this.replyingEventChannel = replyingEventChannel
    this.retryingEventChannel = retryingEventChannel
    this.invocatingEventFactory = invocatingEventFactory
    this.replyingEventFactory = replyingEventFactory
    this.retryingEventFactory = retryingEventFactory
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

  public async perform(): Promise<TResult> {
    const invocation = this.invocationFactory.create(
      this.invocatingEventChannel,
      this.replyingEventChannel,
      this.retryingEventChannel,
      this.abortController,
      this.invocatingEventFactory,
      this.replyingEventFactory,
      this.retryingEventFactory,
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
