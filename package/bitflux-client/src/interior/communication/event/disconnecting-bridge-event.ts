import type { BridgeEvent } from './bridge-event'

export interface DisconnectingBridgeEvent extends BridgeEvent {
  readonly reason: string
}
