import type { Bridge } from '../../bridge'

import type { DisconnectingBridgeEvent } from './disconnecting-bridge-event'

export interface DisconnectingBridgeEventFactory {
  create(target: Bridge, reason: string): DisconnectingBridgeEvent
}
