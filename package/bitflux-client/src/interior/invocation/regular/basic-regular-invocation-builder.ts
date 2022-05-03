import { nanoid } from 'nanoid'

import type { RegularInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InvocationEventChannel,
  InvocationEventFactory,
  InvocationResultEventChannel,
  InvocationResultEventFactory,
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

  private readonly invocationEventChannel: InvocationEventChannel

  private readonly invocationResultEventChannel: InvocationResultEventChannel

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly invocationResultEventFactory: InvocationResultEventFactory

  private readonly bridge: Bridge

  public constructor(
    handlerName: string,
    defaultRejectionDelay: number,
    defaultAttempRejectionDelay: number,
    invocationEventChannel: InvocationEventChannel,
    invocationResultEventChannel: InvocationResultEventChannel,
    invocationEventFactory: InvocationEventFactory,
    invocationResultEventFactory: InvocationResultEventFactory,
    bridge: Bridge,
  ) {
    this.handlerName = handlerName
    this.rejectionDelay = defaultRejectionDelay
    this.attemptRejectionDelay = defaultAttempRejectionDelay
    this.invocationEventChannel = invocationEventChannel
    this.invocationResultEventChannel = invocationResultEventChannel
    this.invocationEventFactory = invocationEventFactory
    this.invocationResultEventFactory = invocationResultEventFactory
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
      this.invocationEventChannel,
      this.invocationResultEventChannel,
      this.invocationEventFactory,
      this.invocationResultEventFactory,
      this.bridge,
    ).perform()
  }
}
