import type { InvocationEvent } from '../invocation-event'

export interface ReplyEvent<TResult = unknown>
  extends InvocationEvent<TResult> {
  readonly result: TResult

  replaceResult(result: TResult): void
}
