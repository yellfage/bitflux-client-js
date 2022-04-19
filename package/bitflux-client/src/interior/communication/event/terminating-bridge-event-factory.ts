import type { Bridge } from '../bridge'

import type { TerminatingBridgeEvent } from './terminating-bridge-event'

export interface TerminatingBridgeEventFactory {
  create(bridge: Bridge, reason: string): TerminatingBridgeEvent
}
