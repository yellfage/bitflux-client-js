import { WebSocketCloseStatus } from './web-socket-close-status'

export type DisconnectedEvent = {
  readonly status?: WebSocketCloseStatus
  readonly statusDescription?: string
}
