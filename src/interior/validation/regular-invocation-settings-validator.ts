import { RegularInvocationSettings } from '../../configuration'
import { NumberUtils } from '../number-utils'

export class RegularInvocationSettingsValidator {
  public static validate({
    rejectionDelay,
    attemptRejectionDelay
  }: RegularInvocationSettings): void {
    if (!NumberUtils.isNumber(rejectionDelay) || Number.isNaN(rejectionDelay)) {
      throw new TypeError(
        'Invalid regular invocation settings: the "rejectionDelay" field must be a number'
      )
    }

    if (
      !NumberUtils.isNumber(attemptRejectionDelay) ||
      Number.isNaN(attemptRejectionDelay)
    ) {
      throw new TypeError(
        'Invalid regular invocation settings: the "attemptRejectionDelay" field must be a number'
      )
    }
  }
}
