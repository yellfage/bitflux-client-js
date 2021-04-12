import { WebSocketCloseStatus } from '../web-socket-close-status'

export type ReconnectionConfirmationContext = {
  readonly closeStatus?: WebSocketCloseStatus
  readonly closeStatusDescription?: string
}
