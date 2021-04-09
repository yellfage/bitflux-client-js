import { IncomingInvocationEvent } from './incoming-invocation-event'

export type IncomingInvocationEventHandler = (
  event: IncomingInvocationEvent
) => any
