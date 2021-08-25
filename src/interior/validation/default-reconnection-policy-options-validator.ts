import { DefaultReconnectionPolicyOptions } from '../../configuration/default-reconnection-policy-options'
import { NumberUtils } from '../number-utils'

export class DefaultReconnectionPolicyOptionsValidator {
  public static validate({
    delays,
    minDelayOffset,
    maxDelayOffset,
    maxAttemptsAfterDelays,
    reconnectableCodes
  }: DefaultReconnectionPolicyOptions): void {
    if (delays !== undefined && !Array.isArray(delays)) {
      throw TypeError(
        'Invalid default reconnection policy options: the "delays" field must be an array'
      )
    }

    if (
      minDelayOffset !== undefined &&
      (!NumberUtils.isNumber(minDelayOffset) || Number.isNaN(minDelayOffset))
    ) {
      throw TypeError(
        'Invalid default reconnection policy options: the "minDelayOffset" field must be an number'
      )
    }

    if (
      maxDelayOffset !== undefined &&
      (!NumberUtils.isNumber(maxDelayOffset) || Number.isNaN(maxDelayOffset))
    ) {
      throw TypeError(
        'Invalid default reconnection policy options: the "maxDelayOffset" field must be an number'
      )
    }

    if (
      maxAttemptsAfterDelays !== undefined &&
      (!NumberUtils.isNumber(maxAttemptsAfterDelays) ||
        Number.isNaN(maxAttemptsAfterDelays))
    ) {
      throw TypeError(
        'Invalid default reconnection policy options: the "maxAttemptsAfterDelays" field must be an number'
      )
    }

    if (
      reconnectableCodes !== undefined &&
      !Array.isArray(reconnectableCodes)
    ) {
      throw TypeError(
        'Invalid default reconnection policy options: the "reconnectableCodes" field must be a function'
      )
    }
  }
}
