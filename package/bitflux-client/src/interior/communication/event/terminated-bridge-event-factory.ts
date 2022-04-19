import type { Bridge } from '../bridge'

import type { TerminatedBridgeEvent } from './terminated-bridge-event'

export interface TerminatedBridgeEventFactory {
  create(bridge: Bridge, reason: string): TerminatedBridgeEvent
}
