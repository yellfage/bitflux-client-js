import type { DisconnectingBridgeEvent } from './disconnecting-bridge-event'

export type DisconnectingBridgeEventHandler = (
  event: DisconnectingBridgeEvent,
) => unknown
