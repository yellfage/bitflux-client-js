import type { BridgeEvent } from './bridge-event'

export interface BridgeReconnectingEvent extends BridgeEvent {
  readonly attempts: number
  readonly delay: number
}
