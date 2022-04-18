import type { BridgeEvent } from './bridge-event'

export interface TerminatedBridgeEvent extends BridgeEvent {
  readonly reason: string
}
