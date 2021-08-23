import { NumberUtils } from '../interior/number-utils'

export class RegularInvocationSettings {
  public rejectionDelay: number
  public attemptRejectionDelay: number

  public constructor(rejectionDelay = 30000, attemptRejectionDelay = 8000) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
  }

  public static validate(settings: RegularInvocationSettings): void {
    if (
      !NumberUtils.isNumber(settings.rejectionDelay) ||
      Number.isNaN(settings.rejectionDelay)
    ) {
      throw new TypeError(
        'Invalid regular invocation settings: the "rejectionDelay" field must be a number'
      )
    }

    if (
      !NumberUtils.isNumber(settings.attemptRejectionDelay) ||
      Number.isNaN(settings.attemptRejectionDelay)
    ) {
      throw new TypeError(
        'Invalid regular invocation settings: the "attemptRejectionDelay" field must be a number'
      )
    }
  }
}
