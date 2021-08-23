import { DisconnectionCode } from '../../communication'

export interface WebSocketDisconnectedEvent {
  readonly code: DisconnectionCode
  readonly reason: string
}
