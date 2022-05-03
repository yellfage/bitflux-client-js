import type { InvocationResultEvent } from './invocation-result-event'

export type InvocationResultEventHandler = (
  event: InvocationResultEvent,
) => unknown
