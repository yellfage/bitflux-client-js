import type { InvocationEvent } from '../invocation-event'

export interface RetryEvent extends InvocationEvent {
  readonly delay: number
}
