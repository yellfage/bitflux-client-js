import type { LifetimeEvents } from '../../lifetime-events'

import type { WebSocketMessageEvent } from './web-socket-message-event'

export type WebSocketEvents = LifetimeEvents & {
  message: (event: WebSocketMessageEvent) => unknown
}
