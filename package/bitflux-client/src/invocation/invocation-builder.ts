export interface InvocationBuilder<TResult> {
  setArgs(...args: unknown[]): this
  perform(): TResult
}
