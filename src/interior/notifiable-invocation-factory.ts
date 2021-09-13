import { InvocationFactory } from './invocation-factory'

import { NotifiableInvocation } from './notifiable-invocation'

import type { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class NotifiableInvocationFactory extends InvocationFactory {
  public create(shape: NotifiableInvocationShape): NotifiableInvocation {
    return new NotifiableInvocation(this.webSocket, shape)
  }
}
