import type { RegularInvocationSetup } from '../../regular-invocation-setup'

import { isNumber } from '../number-utils'

import { validateInvocationSetup } from './validate-invocation-setup'

export function validateRegularInvocationSetup(
  setup: RegularInvocationSetup
): void {
  validateInvocationSetup(setup)

  const { rejectionDelay, attemptRejectionDelay } = setup

  if (
    rejectionDelay != null &&
    (!isNumber(rejectionDelay) || Number.isNaN(rejectionDelay))
  ) {
    throw new TypeError(
      'Invalid regular invocation setup: the "rejectionDelay" field must be a number'
    )
  }

  if (
    attemptRejectionDelay != null &&
    (!isNumber(attemptRejectionDelay) || Number.isNaN(attemptRejectionDelay))
  ) {
    throw new TypeError(
      'Invalid regular invocation setup: the "attemptRejectionDelay" field must be a number'
    )
  }
}
