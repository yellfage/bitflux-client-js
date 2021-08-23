import { NotifiableInvocationSetup } from '../notifiable-invocation-setup'
import { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class NotifiableInvocationShapeFactory {
  public create({
    handlerName,
    args = []
  }: NotifiableInvocationSetup): NotifiableInvocationShape {
    return new NotifiableInvocationShape(handlerName, args)
  }
}
