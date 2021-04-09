/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PlainObject } from './plain-object'

export class ObjectHelper {
  /**
   * Determines whether a value is a plain object.
   * @param {value} a testable value.
   */
  static isPlainObject(value: any): value is PlainObject {
    return !!value && Object.getPrototypeOf(value) === Object.prototype
  }

  /**
   * Determines whether a value is undefined or null.
   * @param {value} a testable value.
   */
  static isNullOrUndefined(value: any): boolean {
    return value == null
  }

  /**
   * Determines whether an object has a property with the specified name.
   * @param {property} a property name.
   */
  static hasOwnProperty<O extends PlainObject>(
    obj: O,
    property: keyof O
  ): boolean {
    return Object.prototype.hasOwnProperty.call(obj, property)
  }

  /**
   * Determines whether a value of some field is equal to testable.
   * @param {obj} a target object.
   * @param {value} a testable value.
   */
  static someEqual(obj: PlainObject, value: any): boolean {
    return Object.keys(obj).some((key) => obj[key] === value)
  }

  /**
   * Determines whether all field values are equal to testable.
   * @param {obj} a target object.
   * @param {value} a testable value.
   */
  static everyEqual(obj: PlainObject, value: any): boolean {
    return Object.keys(obj).every((key) => obj[key] === value)
  }

  /**
   * Replaces an object values according to properties.
   * @param {obj} a target object.
   * @param {properties} replaceable properties.
   */
  static replace<O extends PlainObject>(obj: O, properties: Partial<O>): void {
    for (const key of Object.keys(properties)) {
      obj[key as any] = properties[key]
    }
  }

  /**
   * Determines a number of keys of a specific object.
   * @param {obj} a target object.
   */
  static size(obj: PlainObject): number {
    return Object.keys(obj).length
  }

  /**
   * Creates a new object omitting the specified keys.
   * @param {obj} a target object.
   * @param {keys} keys for omitting.
   */
  static omit<O extends PlainObject, K extends keyof O>(
    obj: O,
    keys: K[]
  ): Omit<O, K> {
    const nextObj = {}

    for (const key of Object.keys(obj)) {
      if (!keys.includes(key as any)) {
        nextObj[key] = obj[key]
      }
    }
    return nextObj as any
  }
}
