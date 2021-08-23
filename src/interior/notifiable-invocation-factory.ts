import { InvocationFactory } from './invocation-factory'
import { NotifiableInvocationShape } from './notifiable-invocation-shape'
import { NotifiableInvocation } from './notifiable-invocation'

export class NotifiableInvocationFactory extends InvocationFactory {
  public create(shape: NotifiableInvocationShape): NotifiableInvocation {
    return new NotifiableInvocation(this.webSocket, shape)
  }
}
