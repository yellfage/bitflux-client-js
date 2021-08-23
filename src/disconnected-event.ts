import { DisconnectionCode } from './communication'

export interface DisconnectedEvent {
  readonly code: DisconnectionCode
  readonly reason: string
}
