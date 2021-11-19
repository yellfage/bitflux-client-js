import type { DisconnectionCode } from '../../communication'

import type { BridgeEvent } from './bridge-event'

export interface BridgeDisconnectedEvent extends BridgeEvent {
  readonly code: DisconnectionCode
  readonly reason: string
}
