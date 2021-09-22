/**
 * Removes items from an array
 * @param array The target array
 * @returns boolean The status of removing
 */
export function removeFromArray<T>(array: T[], ...items: T[]): boolean {
  return items.every((item) => {
    const index = array.indexOf(item)

    if (index > -1) {
      array.splice(index, 1)
    }

    return index > -1
  })
}
