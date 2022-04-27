import type { EventEmitter } from '@yellfage/event-emitter'

import type { InvocationEventHandlerMap } from '../../../event'

import type { RegularInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InvocationEventFactory,
  InvocationResultEventFactory,
} from '../../event'

import { BasicRegularInvocationBuilder } from './basic-regular-invocation-builder'

import type { RegularInvocationBuilderFactory } from './regular-invocation-builder-factory'

export class BasicRegularInvocationBuilderFactory
  implements RegularInvocationBuilderFactory
{
  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  private readonly eventEmitter: EventEmitter<InvocationEventHandlerMap>

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly invocationResultEventFactory: InvocationResultEventFactory

  private readonly bridge: Bridge

  public constructor(
    rejectionDelay: number,
    attempRejectionDelay: number,
    eventEmitter: EventEmitter<InvocationEventHandlerMap>,
    invocationEventFactory: InvocationEventFactory,
    invocationResultEventFactory: InvocationResultEventFactory,
    bridge: Bridge,
  ) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attempRejectionDelay
    this.eventEmitter = eventEmitter
    this.invocationEventFactory = invocationEventFactory
    this.invocationResultEventFactory = invocationResultEventFactory
    this.bridge = bridge
  }

  public create<TResult>(
    handlerName: string,
  ): RegularInvocationBuilder<TResult> {
    return new BasicRegularInvocationBuilder(
      handlerName,
      this.rejectionDelay,
      this.attemptRejectionDelay,
      this.eventEmitter,
      this.invocationEventFactory,
      this.invocationResultEventFactory,
      this.bridge,
    )
  }
}
