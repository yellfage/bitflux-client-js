import type { Callback } from './callback'

/**
 * Finds out whether or not a value is a function
 * @param value The testable value
 */
export function isFunction<TFunction extends Callback = Callback>(
  value: unknown
): value is TFunction {
  return typeof value === 'function'
}
