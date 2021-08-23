/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class NumberUtils {
  /**
   * Determines whether a value is a number
   * @param {value} The testable value
   */
  static isNumber(value: any): value is number {
    return typeof value === 'number'
  }

  /**
   * Returns a number in fixed-point notation
   * @param {num} The target number
   * @param {fractionDigits} The number of digits after the decimal point
   */
  static fixed(num: number, fractionDigits: number): number {
    return +num.toFixed(fractionDigits)
  }

  /**
   * Determines whether a number within a specific length
   * @param {num} The target number
   * @param {min} The minimum number
   * @param {max} The maximum number
   */
  static withinRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max
  }
}
