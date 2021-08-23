import { NumberUtils } from '../interior/number-utils'
import { FunctionUtils } from '../interior/function-utils'
import { ReconnectionConfirmationCallback } from './reconnection-confirmation-callback'

export class DefaultReconnectionPolicyOptions {
  public readonly delays?: number[]
  public readonly minDelayOffset?: number
  public readonly maxDelayOffset?: number
  public readonly maxAttemptsAfterDelays?: number
  public readonly confirm?: ReconnectionConfirmationCallback

  public static validate(options: DefaultReconnectionPolicyOptions): void {
    const {
      delays,
      minDelayOffset,
      maxDelayOffset,
      maxAttemptsAfterDelays,
      confirm
    } = options

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

    if (confirm !== undefined && !FunctionUtils.isFunction(confirm)) {
      throw TypeError(
        'Invalid default reconnection policy options: the "confirm" field must be a function'
      )
    }
  }
}
