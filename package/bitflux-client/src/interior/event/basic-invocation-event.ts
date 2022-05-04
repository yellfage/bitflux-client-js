import type { InvocationEvent } from '../../event'

import type { Invocation } from '../invocation'

export abstract class BasicInvocationEvent<TResult = unknown>
  implements InvocationEvent<TResult>
{
  public readonly target: Invocation<TResult>

  public constructor(target: Invocation<TResult>) {
    this.target = target
  }
}
