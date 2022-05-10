import type { InvocationEvent } from '../invocation-event'

export interface ReplyingEvent extends InvocationEvent {
  readonly result: unknown

  replaceResult(result: unknown): void
}
