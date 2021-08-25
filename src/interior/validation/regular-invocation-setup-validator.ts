import { RegularInvocationSetup } from '../../regular-invocation-setup'
import { InvocationSetupValidator } from './invocation-setup-validator'
import { NumberUtils } from '../number-utils'

export class RegularInvocationSetupValidator {
  public static validate(setup: RegularInvocationSetup): void {
    InvocationSetupValidator.validate(setup)

    const { rejectionDelay, attemptRejectionDelay } = setup

    if (
      rejectionDelay !== undefined &&
      (!NumberUtils.isNumber(rejectionDelay) || Number.isNaN(rejectionDelay))
    ) {
      throw new TypeError(
        'Invalid regular invocation setup: the "rejectionDelay" field must be a number'
      )
    }

    if (
      attemptRejectionDelay !== undefined &&
      (!NumberUtils.isNumber(attemptRejectionDelay) ||
        Number.isNaN(attemptRejectionDelay))
    ) {
      throw new TypeError(
        'Invalid regular invocation setup: the "attemptRejectionDelay" field must be a number'
      )
    }
  }
}
