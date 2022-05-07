import type { InvocationEvent } from '../../event'

import type { Invocation } from '../../invocation'

export abstract class BasicInvocationEvent implements InvocationEvent {
  public readonly target: Invocation

  public constructor(target: Invocation) {
    this.target = target
  }
}
