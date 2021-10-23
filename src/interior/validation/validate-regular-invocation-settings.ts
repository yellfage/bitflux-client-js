import type { RegularInvocationSettings } from '../../configuration'

import { isNumber } from '../is-number'

export function validateRegularInvocationSettings({
  rejectionDelay,
  attemptRejectionDelay
}: RegularInvocationSettings): void {
  if (!isNumber(rejectionDelay) || Number.isNaN(rejectionDelay)) {
    throw new TypeError(
      'Invalid regular invocation settings: the "rejectionDelay" field must be a number'
    )
  }

  if (!isNumber(attemptRejectionDelay) || Number.isNaN(attemptRejectionDelay)) {
    throw new TypeError(
      'Invalid regular invocation settings: the "attemptRejectionDelay" field must be a number'
    )
  }
}
