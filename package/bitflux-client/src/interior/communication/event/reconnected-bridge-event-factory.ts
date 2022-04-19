import type { Bridge } from '../bridge'

import type { ReconnectedBridgeEvent } from './reconnected-bridge-event'

export interface ReconnectedBridgeEventFactory {
  create(bridge: Bridge, attempts: number): ReconnectedBridgeEvent
}
