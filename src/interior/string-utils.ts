/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export class StringUtils {
  /**
   * Determines whether a value is a string
   * @param {value} The testable value
   */
  static isString(value: any): value is string {
    return typeof value === 'string'
  }

  /**
   * Determines whether a string within a specific length.
   * @param {str} The target string
   * @param {min} The minimum length
   * @param {max} The maximum length
   */
  static withinLength(str: string, min: number, max: number): boolean {
    return str.length >= min && str.length <= max
  }
}
