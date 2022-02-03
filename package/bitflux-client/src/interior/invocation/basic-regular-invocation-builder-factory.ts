import type { RegularInvocationBuilder } from '../../invocation'

import type { Bridge } from '../communication'

import { BasicRegularInvocationBuilder } from './basic-regular-invocation-builder'

import type { RegularInvocationBuilderFactory } from './regular-invocation-builder-factory'

export class BasicRegularInvocationBuilderFactory
  implements RegularInvocationBuilderFactory
{
  private readonly bridge: Bridge

  private readonly rejectionDelay: number

  private readonly attemptRejectionDelay: number

  public constructor(
    bridge: Bridge,
    rejectionDelay: number,
    attempRejectionDelay: number,
  ) {
    this.bridge = bridge
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attempRejectionDelay
  }

  public create<TResult>(
    handlerName: string,
  ): RegularInvocationBuilder<TResult> {
    return new BasicRegularInvocationBuilder(
      this.bridge,
      handlerName,
      this.rejectionDelay,
      this.attemptRejectionDelay,
    )
  }
}
