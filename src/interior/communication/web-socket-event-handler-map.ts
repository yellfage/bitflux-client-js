import type { LifetimeEventHandlerMap } from '../../lifetime-event-handler-map'

import type { WebSocketMessageEvent } from './web-socket-message-event'

export type WebSocketEventHandlerMap = LifetimeEventHandlerMap & {
  message: (event: WebSocketMessageEvent) => unknown
}
