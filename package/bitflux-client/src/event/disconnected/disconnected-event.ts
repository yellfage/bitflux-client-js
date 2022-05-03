import type { DisconnectionCode } from '../../communication'

import type { ClientEvent } from '../client-event'

export interface DisconnectedEvent extends ClientEvent {
  readonly code: DisconnectionCode
  readonly reason: string
}
