import type { InvocationEvent } from './invocation-event'

import type { InvocationResultEvent } from './invocation-result-event'

export type InvocationEventHandlerMap = {
  invocation: (event: InvocationEvent) => unknown
  invocationResult: (event: InvocationResultEvent) => unknown
}
