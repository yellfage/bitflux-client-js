import type { EventEmitter } from '@yellfage/event-emitter'

import { nanoid } from 'nanoid'

import type { InvocationEventHandlerMap } from '../../../event'

import type { RegularInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InvocationEventFactory,
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

  private readonly eventEmitter: EventEmitter<InvocationEventHandlerMap>

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly invocationResultEventFactory: InvocationResultEventFactory

  private readonly bridge: Bridge

  public constructor(
    handlerName: string,
    defaultRejectionDelay: number,
    defaultAttempRejectionDelay: number,
    eventEmitter: EventEmitter<InvocationEventHandlerMap>,
    invocationEventFactory: InvocationEventFactory,
    invocationResultEventFactory: InvocationResultEventFactory,
    bridge: Bridge,
  ) {
    this.handlerName = handlerName
    this.rejectionDelay = defaultRejectionDelay
    this.attemptRejectionDelay = defaultAttempRejectionDelay
    this.eventEmitter = eventEmitter
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
      this.eventEmitter,
      this.invocationEventFactory,
      this.invocationResultEventFactory,
      this.bridge,
    ).perform()
  }
}
