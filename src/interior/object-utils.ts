/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { PlainObject } from '../plain-object'

export class ObjectUtils {
  /**
   * Determines whether a value is a plain object
   * @param {value} The testable value
   */
  public static isPlainObject<TObject extends PlainObject = PlainObject>(
    value: any
  ): value is TObject {
    return !!value && Object.getPrototypeOf(value) === Object.prototype
  }
}
