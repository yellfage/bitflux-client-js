import type { BridgeEvent } from './bridge-event'

export interface ReconnectedBridgeEvent extends BridgeEvent {
  readonly attempts: number
}
