import { WebSocketCloseStatus } from '../web-socket-close-status'

export type ReconnectionAttemptApprovingContext = {
  readonly closeStatus?: WebSocketCloseStatus
  readonly closeStatusDescription?: string
}
