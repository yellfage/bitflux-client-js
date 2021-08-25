/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export class StringUtils {
  /**
   * Determines whether a value is a string
   * @param {value} The testable value
   */
  static isString(value: any): value is string {
    return typeof value === 'string'
  }
}
