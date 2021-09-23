import type { DefaultReconnectionPolicyOptions } from '../../reconnection'

import { isNumber } from '../number-utils'

export function validateDefaultReconnectionPolicyOptions({
  delays,
  minDelayOffset,
  maxDelayOffset,
  maxAttemptsAfterDelays,
  reconnectableCodes
}: DefaultReconnectionPolicyOptions): void {
  if (delays != null && !Array.isArray(delays)) {
    throw new TypeError(
      'Invalid default reconnection policy options: the "delays" field must be an array'
    )
  }

  if (
    minDelayOffset != null &&
    (!isNumber(minDelayOffset) || Number.isNaN(minDelayOffset))
  ) {
    throw new TypeError(
      'Invalid default reconnection policy options: the "minDelayOffset" field must be a number'
    )
  }

  if (
    maxDelayOffset != null &&
    (!isNumber(maxDelayOffset) || Number.isNaN(maxDelayOffset))
  ) {
    throw new TypeError(
      'Invalid default reconnection policy options: the "maxDelayOffset" field must be a number'
    )
  }

  if (
    maxAttemptsAfterDelays != null &&
    (!isNumber(maxAttemptsAfterDelays) || Number.isNaN(maxAttemptsAfterDelays))
  ) {
    throw new TypeError(
      'Invalid default reconnection policy options: the "maxAttemptsAfterDelays" field must be a number'
    )
  }

  if (reconnectableCodes != null && !Array.isArray(reconnectableCodes)) {
    throw new TypeError(
      'Invalid default reconnection policy options: the "reconnectableCodes" field must be an array'
    )
  }
}
