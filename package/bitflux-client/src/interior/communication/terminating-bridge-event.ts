import type { BridgeEvent } from './bridge-event'

export interface TerminatingBridgeEvent extends BridgeEvent {
  readonly reason: string
}
