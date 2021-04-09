export class UnableStartupError extends Error {
  public constructor(message?: string) {
    super(message)

    super.name = 'UnableStartupError'
  }
}
