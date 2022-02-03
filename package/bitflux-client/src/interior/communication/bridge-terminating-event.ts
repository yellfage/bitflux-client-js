import type { BridgeEvent } from './bridge-event'

export interface BridgeTerminatingEvent extends BridgeEvent {
  readonly reason: string
}
