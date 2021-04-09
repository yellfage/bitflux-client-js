import { WebSocketCloseStatus } from '../../web-socket-close-status'

export type WebSocketCloseEvent = {
  readonly status?: WebSocketCloseStatus
  readonly statusDescription?: string
}
