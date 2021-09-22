/**
 * Finds out whether or not a value is a number
 * @param value The testable value
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}
