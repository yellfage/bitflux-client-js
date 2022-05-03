import type { Bridge } from '../../bridge'

import type { ConnectedBridgeEvent } from './connected-bridge-event'

export interface ConnectedBridgeEventFactory {
  create(target: Bridge): ConnectedBridgeEvent
}
