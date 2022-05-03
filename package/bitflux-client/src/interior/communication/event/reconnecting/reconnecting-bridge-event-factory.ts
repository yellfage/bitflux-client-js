import type { Bridge } from '../../bridge'

import type { ReconnectingBridgeEvent } from './reconnecting-bridge-event'

export interface ReconnectingBridgeEventFactory {
  create(
    target: Bridge,
    attempts: number,
    delay: number,
  ): ReconnectingBridgeEvent
}
