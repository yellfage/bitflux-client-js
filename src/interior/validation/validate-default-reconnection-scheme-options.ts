import type { DefaultReconnectionSchemeOptions } from '../../reconnection'

import { isNumber } from '../is-number'

export function validateDefaultReconnectionSchemeOptions({
  delays,
  minDelayOffset,
  maxDelayOffset,
  maxAttemptsAfterDelays,
  reconnectableCodes
}: DefaultReconnectionSchemeOptions): void {
  if (delays != null && !Array.isArray(delays)) {
    throw new TypeError(
      'Invalid default reconnection scheme options: the "delays" field must be an array'
    )
  }

  if (
    minDelayOffset != null &&
    (!isNumber(minDelayOffset) || Number.isNaN(minDelayOffset))
  ) {
    throw new TypeError(
      'Invalid default reconnection scheme options: the "minDelayOffset" field must be a number'
    )
  }

  if (
    maxDelayOffset != null &&
    (!isNumber(maxDelayOffset) || Number.isNaN(maxDelayOffset))
  ) {
    throw new TypeError(
      'Invalid default reconnection scheme options: the "maxDelayOffset" field must be a number'
    )
  }

  if (
    maxAttemptsAfterDelays != null &&
    (!isNumber(maxAttemptsAfterDelays) || Number.isNaN(maxAttemptsAfterDelays))
  ) {
    throw new TypeError(
      'Invalid default reconnection scheme options: the "maxAttemptsAfterDelays" field must be a number'
    )
  }

  if (reconnectableCodes != null && !Array.isArray(reconnectableCodes)) {
    throw new TypeError(
      'Invalid default reconnection scheme options: the "reconnectableCodes" field must be an array'
    )
  }
}
