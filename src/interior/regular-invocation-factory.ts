import { InvocationFactory } from './invocation-factory'

import { RegularInvocation } from './regular-invocation'

import type { RegularInvocationShape } from './regular-invocation-shape'

export class RegularInvocationFactory extends InvocationFactory {
  public create(shape: RegularInvocationShape): RegularInvocation {
    return new RegularInvocation(this.webSocket, shape)
  }
}
