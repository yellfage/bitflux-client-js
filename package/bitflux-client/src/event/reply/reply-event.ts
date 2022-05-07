import type { InvocationEvent } from '../invocation-event'

export interface ReplyEvent extends InvocationEvent {
  readonly result: unknown

  replaceResult(result: unknown): void
}
