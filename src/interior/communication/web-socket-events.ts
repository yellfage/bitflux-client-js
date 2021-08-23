import { WebSocketConnectingEvent } from './web-socket-connecting-event'
import { WebSocketConnectedEvent } from './web-socket-connected-event'
import { WebSocketReconnectingEvent } from './web-socket-reconnecting-event'
import { WebSocketReconnectedEvent } from './web-socket-reconnected-event'
import { WebSocketDisconnectedEvent } from './web-socket-disconnected-event'
import { WebSocketTerminatingEvent } from './web-socket-terminating-event'
import { WebSocketTerminatedEvent } from './web-socket-terminated-event'
import { WebSocketMessageEvent } from './web-socket-message-event'

export type WebSocketEvents = {
  connecting: (event: WebSocketConnectingEvent) => any
  connected: (event: WebSocketConnectedEvent) => any
  reconnecting: (event: WebSocketReconnectingEvent) => any
  reconnected: (event: WebSocketReconnectedEvent) => any
  disconnected: (event: WebSocketDisconnectedEvent) => any
  terminating: (event: WebSocketTerminatingEvent) => any
  terminated: (event: WebSocketTerminatedEvent) => any
  message: (event: WebSocketMessageEvent) => any
}
