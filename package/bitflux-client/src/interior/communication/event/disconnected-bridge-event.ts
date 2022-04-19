import type { DisconnectionCode } from '../../../communication'

import type { BridgeEvent } from './bridge-event'

export interface DisconnectedBridgeEvent extends BridgeEvent {
  readonly code: DisconnectionCode
  readonly reason: string
}
