import { AbortError } from '../../../abort-error'

import type {
  Invocation,
  RetryControl,
  RetryDelayScheme,
} from '../../../invocation'

import type { Bridge } from '../../communication'

import { OutgoingNotifiableInvocationMessage } from '../../communication'

import type {
  InvocatingEventChannel,
  InvocatingEventFactory,
  ReplyingEventChannel,
  ReplyingEventFactory,
  RetryingEventChannel,
  RetryingEventFactory,
} from '../../event'

export class NotifiableInvocation implements Invocation {
  public readonly handlerName: string

  public readonly args: unknown[]

  public readonly invocating: InvocatingEventChannel

  public readonly replying: ReplyingEventChannel

  public readonly retrying: RetryingEventChannel

  public readonly abortController: AbortController

  private readonly invocatingEventFactory: InvocatingEventFactory

  private readonly replyingEventFactory: ReplyingEventFactory

  private readonly retryingEventFactory: RetryingEventFactory

  private readonly bridge: Bridge

  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  private readonly retryControl: RetryControl

  private readonly retryDelayScheme: RetryDelayScheme

  public constructor(
    handlerName: string,
    args: unknown[],
    invocatingEventChannel: InvocatingEventChannel,
    replyingEventChannel: ReplyingEventChannel,
    retryingEventChannel: RetryingEventChannel,
    abortController: AbortController,
    invocatingEventFactory: InvocatingEventFactory,
    replyingEventFactory: ReplyingEventFactory,
    retryingEventFactory: RetryingEventFactory,
    bridge: Bridge,
    rejectionDelay: number,
    attemptRejectionDelay: number,
    retryControl: RetryControl,
    retryDelayScheme: RetryDelayScheme,
  ) {
    this.handlerName = handlerName
    this.args = args
    this.invocating = invocatingEventChannel
    this.replying = replyingEventChannel
    this.retrying = retryingEventChannel
    this.abortController = abortController
    this.invocatingEventFactory = invocatingEventFactory
    this.replyingEventFactory = replyingEventFactory
    this.retryingEventFactory = retryingEventFactory
    this.bridge = bridge
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
    this.retryControl = retryControl
    this.retryDelayScheme = retryDelayScheme
  }

  public async perform(): Promise<void> {
    if (this.abortController.signal.aborted) {
      throw new Error('The provided AbortController is already aborted')
    }

    const invocatingEvent = this.invocatingEventFactory.create(this)

    await this.invocating.emit(invocatingEvent)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.abortController.signal.aborted) {
      throw new AbortError('The invocation has been aborted')
    }

    this.bridge.send(
      new OutgoingNotifiableInvocationMessage(this.handlerName, this.args),
    )
  }
}
