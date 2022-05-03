import type { InvocationEvent } from './invocation-event'

export type InvocationEventHandler = (event: InvocationEvent) => unknown
