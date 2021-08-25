import { NotifiableInvocationSetup } from '../../notifiable-invocation-setup'
import { InvocationSetupValidator } from './invocation-setup-validator'

export class NotifiableInvocationSetupValidator {
  public static validate(setup: NotifiableInvocationSetup): void {
    InvocationSetupValidator.validate(setup)
  }
}
