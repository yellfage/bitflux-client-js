import { WebSocketMessageEvent } from './web-socket-message-event'

export type WebSocketMessageEventHandler = (event: WebSocketMessageEvent) => any
