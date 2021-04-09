export class InvalidOperationError extends Error {
  public constructor(message?: string) {
    super(message)

    super.name = 'InvalidOperationError'
  }
}
