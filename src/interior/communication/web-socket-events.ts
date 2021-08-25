import { LifetimeEvents } from '../../lifetime-events'
import { WebSocketMessageEvent } from './web-socket-message-event'

export type WebSocketEvents = LifetimeEvents & {
  message: (event: WebSocketMessageEvent) => any
}
