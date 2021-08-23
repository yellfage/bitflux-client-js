export class ArrayUtils {
  /**
   * Removes items from an array
   * @param {array} The target array
   * @returns {boolean} The remove status
   */
  static remove<T>(array: T[], ...items: T[]): boolean {
    return items.every((item) => {
      const index = array.indexOf(item)

      if (index > -1) {
        array.splice(index, 1)
      }

      return index > -1
    })
  }

  /**
   * Returns the last element of an array
   * @param {array} The target array
   * @returns {T} The last item
   */
  static getLast<T>(array: T[]): T | undefined {
    return array[array.length - 1]
  }
}
