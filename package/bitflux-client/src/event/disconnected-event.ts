import type { DisconnectionCode } from '../communication'

import type { Event } from './event'

export interface DisconnectedEvent extends Event {
  readonly code: DisconnectionCode
  readonly reason: string
}
