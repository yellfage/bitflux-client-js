export class OperationAbortedError extends Error {
  public constructor(message?: string) {
    super(message)

    super.name = 'OperationAbortedError'
  }
}
