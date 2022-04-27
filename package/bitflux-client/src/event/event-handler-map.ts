import type { ClientEventHandlerMap } from './client-event-handler-map'

import type { InvocationEventHandlerMap } from './invocation-event-handler-map'

export type EventHandlerMap = ClientEventHandlerMap & InvocationEventHandlerMap
