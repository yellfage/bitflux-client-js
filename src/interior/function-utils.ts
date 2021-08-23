/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Callback } from './callback'

export class FunctionUtils {
  /**
   * Determines whether a value is a function
   * @param {value} The testable value
   */
  public static isFunction<TFunction extends Callback = Callback>(
    value: any
  ): value is TFunction {
    return typeof value === 'function'
  }
}
