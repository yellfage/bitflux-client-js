import type { Bridge } from '../bridge'

import type { ConnectingBridgeEvent } from './connecting-bridge-event'

export interface ConnectingBridgeEventFactory {
  create(bridge: Bridge): ConnectingBridgeEvent
}
