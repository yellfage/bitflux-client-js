import type { Bridge } from '../bridge'

import type { ReconnectingBridgeEvent } from './reconnecting-bridge-event'

export interface ReconnectingBridgeEventFactory {
  create(
    bridge: Bridge,
    attempts: number,
    delay: number,
  ): ReconnectingBridgeEvent
}
