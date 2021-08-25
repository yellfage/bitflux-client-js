/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class NumberUtils {
  /**
   * Determines whether a value is a number
   * @param {value} The testable value
   */
  static isNumber(value: any): value is number {
    return typeof value === 'number'
  }
}
