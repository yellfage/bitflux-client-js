/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class StringHelper {
  /**
   * Determines whether a value is a string.
   * @param {value} a testable value.
   */
  static isString(value: any): value is string {
    return typeof value === 'string'
  }

  /**
   * Determines whether a string within a specific length.
   * @param {str} a target string.
   * @param {min} a minimum length.
   * @param {max} a maximum length.
   */
  static withinLength(str: string, min: number, max: number): boolean {
    return str.length >= min && str.length <= max
  }
}
