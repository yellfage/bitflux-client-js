/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class NumberHelper {
  /**
   * Determines whether a value is a number.
   * @param {value} a testable value.
   */
  static isNumber(value: any): value is number {
    return typeof value === 'number'
  }

  /**
   * Returns a number in fixed-point notation.
   * @param {num} a target number.
   * @param {fractionDigits} a number of digits after the decimal point.
   */
  static fixed(num: number, fractionDigits: number): number {
    return +num.toFixed(fractionDigits)
  }

  /**
   * Determines whether a number within a specific length.
   * @param {num} a target number.
   * @param {min} a minimum number.
   * @param {max} a maximum number.
   */
  static withinRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max
  }
}
