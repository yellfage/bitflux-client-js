import type { BridgeEvent } from './bridge-event'

export interface BridgeTerminatedEvent extends BridgeEvent {
  readonly reason: string
}
