import type { RegularInvocationBuilder } from '../../../invocation'

import type { Bridge } from '../../communication'

import type {
  InvocationEventChannel,
  InvocationEventFactory,
  InvocationResultEventChannel,
  InvocationResultEventFactory,
} from '../../event'

import { BasicRegularInvocationBuilder } from './basic-regular-invocation-builder'

import type { RegularInvocationBuilderFactory } from './regular-invocation-builder-factory'

export class BasicRegularInvocationBuilderFactory
  implements RegularInvocationBuilderFactory
{
  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  private readonly invocationEventChannel: InvocationEventChannel

  private readonly invocationResultEventChannel: InvocationResultEventChannel

  private readonly invocationEventFactory: InvocationEventFactory

  private readonly invocationResultEventFactory: InvocationResultEventFactory

  private readonly bridge: Bridge

  public constructor(
    rejectionDelay: number,
    attempRejectionDelay: number,
    invocationEventChannel: InvocationEventChannel,
    invocationResultEventChannel: InvocationResultEventChannel,
    invocationEventFactory: InvocationEventFactory,
    invocationResultEventFactory: InvocationResultEventFactory,
    bridge: Bridge,
  ) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attempRejectionDelay
    this.invocationEventChannel = invocationEventChannel
    this.invocationEventFactory = invocationEventFactory
    this.invocationResultEventChannel = invocationResultEventChannel
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
      this.invocationEventChannel,
      this.invocationResultEventChannel,
      this.invocationEventFactory,
      this.invocationResultEventFactory,
      this.bridge,
    )
  }
}
