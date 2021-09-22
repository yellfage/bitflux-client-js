import type { PlainObject } from '../plain-object'

/**
 * Finds out whether or not a value is a plain object
 * @param value The testable value
 */
export function isPlainObject<TObject extends PlainObject = PlainObject>(
  value: unknown
): value is TObject {
  return Boolean(value) && Object.getPrototypeOf(value) === Object.prototype
}
