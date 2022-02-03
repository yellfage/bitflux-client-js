import type { BridgeEvent } from './bridge-event'

export interface BridgeReconnectedEvent extends BridgeEvent {
  readonly attempts: number
}
