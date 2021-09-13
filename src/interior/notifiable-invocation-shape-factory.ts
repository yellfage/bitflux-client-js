import type { NotifiableInvocationSetup } from '../notifiable-invocation-setup'

import type { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class NotifiableInvocationShapeFactory {
  public create({
    handlerName,
    args = []
  }: NotifiableInvocationSetup): NotifiableInvocationShape {
    return { handlerName, args }
  }
}
