/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class BooleanHelper {
  /**
   * Determines whether a value is a boolean.
   * @param {value} a testable value.
   */
  static isBoolean(value: any): value is boolean {
    return typeof value === 'boolean'
  }
}
