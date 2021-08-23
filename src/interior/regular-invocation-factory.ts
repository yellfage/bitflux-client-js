import { InvocationFactory } from './invocation-factory'
import { RegularInvocationShape } from './regular-invocation-shape'
import { RegularInvocation } from './regular-invocation'

export class RegularInvocationFactory extends InvocationFactory {
  public create(shape: RegularInvocationShape): RegularInvocation {
    return new RegularInvocation(this.webSocket, shape)
  }
}
