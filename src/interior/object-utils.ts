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

  /**
   * Determines whether an object has a property with the specified name
   * @param {property} The property name
   */
  public static hasProperty<TObject extends PlainObject>(
    obj: TObject,
    property: keyof TObject
  ): boolean {
    return Object.prototype.hasOwnProperty.call(obj, property)
  }

  /**
   * Determines whether a value of some field is equal to testable
   * @param {obj} The target object
   * @param {value} The testable value
   */
  public static someEqual(obj: PlainObject, value: any): boolean {
    return Object.keys(obj).some((key) => obj[key] === value)
  }

  /**
   * Determines whether all field values are equal to testable
   * @param {obj} The target object
   * @param {value} The testable value
   */
  public static everyEqual(obj: PlainObject, value: any): boolean {
    return Object.keys(obj).every((key) => obj[key] === value)
  }

  /**
   * Replaces all properties of an object with provided
   * @param {obj} The target object
   * @param {properties} new properties
   */
  public static replace(obj: PlainObject, properties: PlainObject): void {
    this.clear(obj)

    for (const key of Object.keys(properties)) {
      obj[key] = properties[key]
    }
  }

  /**
   * Overwrites an object properties with the provided
   * @param {obj} The target object
   * @param {properties} The replaceable properties
   */
  public static overwrite<TObject extends PlainObject>(
    obj: TObject,
    properties: Partial<TObject>
  ): void {
    for (const key of Object.keys(properties)) {
      obj[key as any] = properties[key]
    }
  }

  /**
   * Clears an object properties
   * @param {obj} The target object
   */
  public static clear(obj: PlainObject): void {
    for (const key of Object.keys(obj)) {
      delete obj[key]
    }
  }

  /**
   * Determines a number of keys of a specific object
   * @param {obj} The target object
   */
  public static size(obj: PlainObject): number {
    return Object.keys(obj).length
  }

  /**
   * Determines whether an object has at least one property
   * @param {obj} The target object
   */
  public static isEmpty(obj: PlainObject): boolean {
    return this.size(obj) === 0
  }

  /**
   * Creates a new object omitting the specified keys.
   * @param {obj} The target object
   * @param {keys} The keys for omitting
   */
  public static omit<TObject extends PlainObject, TKey extends keyof TObject>(
    obj: TObject,
    keys: TKey[]
  ): Omit<TObject, TKey> {
    const nextObj = {}

    for (const key of Object.keys(obj)) {
      if (!keys.includes(key as any)) {
        nextObj[key] = obj[key]
      }
    }
    return nextObj as any
  }
}
