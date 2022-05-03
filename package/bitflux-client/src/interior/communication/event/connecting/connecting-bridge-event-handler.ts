import type { ConnectingBridgeEvent } from './connecting-bridge-event'

export type ConnectingBridgeEventHandler = (
  event: ConnectingBridgeEvent,
) => unknown
