/**
 * Finds out whether or not a value is a string
 * @param value The testable value
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
