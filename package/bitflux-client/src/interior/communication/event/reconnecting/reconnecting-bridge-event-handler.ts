import type { ReconnectingBridgeEvent } from './reconnecting-bridge-event'

export type ReconnectingBridgeEventHandler = (
  event: ReconnectingBridgeEvent,
) => unknown
