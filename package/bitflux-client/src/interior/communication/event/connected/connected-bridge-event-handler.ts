import type { ConnectedBridgeEvent } from './connected-bridge-event'

export type ConnectedBridgeEventHandler = (
  event: ConnectedBridgeEvent,
) => unknown
