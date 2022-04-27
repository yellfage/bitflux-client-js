import type { Invocation } from '../interior'

export interface InvocationResultEvent<TResult = unknown> {
  readonly result: TResult
  readonly invocation: Invocation<TResult>

  replaceResult(result: TResult): void
}
