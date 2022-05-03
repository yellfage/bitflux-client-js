import type { DisconnectedBridgeEvent } from './disconnected-bridge-event'

export type DisconnectedBridgeEventHandler = (
  event: DisconnectedBridgeEvent,
) => unknown
