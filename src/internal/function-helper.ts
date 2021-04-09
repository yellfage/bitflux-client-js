/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Callback } from './callback'

export class FunctionHelper {
  /**
   * Determines whether a value is a function.
   * @param {value} a testable value.
   */
  static isFunction(value: any): value is Callback {
    return typeof value === 'function'
  }
}
