import type { BridgeEvent } from '../bridge-event'

export interface ReconnectingBridgeEvent extends BridgeEvent {
  readonly attempts: number
  readonly delay: number
}
