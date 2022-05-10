import type { InvocationEvent } from '../invocation-event'

export interface RetryingEvent extends InvocationEvent {
  readonly delay: number
}
