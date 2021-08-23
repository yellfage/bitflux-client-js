export class InvocationAbortedError extends Error {
  public constructor(message: string) {
    super(message)

    super.name = 'InvocationAbortedError'
  }
}
