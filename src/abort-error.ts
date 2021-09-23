export class AbortError extends Error {
  public constructor(message: string) {
    super(message)

    super.name = 'AbortError'
  }
}
