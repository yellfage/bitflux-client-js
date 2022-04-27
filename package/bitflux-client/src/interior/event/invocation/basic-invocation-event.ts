import type { InvocationEvent } from '../../../event'

import type { Invocation } from '../../invocation'

export class BasicInvocationEvent implements InvocationEvent {
  public readonly invocation: Invocation<unknown>

  public constructor(invocation: Invocation<unknown>) {
    this.invocation = invocation
  }
}
