import type { ConnectedBridgeEvent } from './connected-bridge-event'

import type { ConnectingBridgeEvent } from './connecting-bridge-event'

import type { DisconnectedBridgeEvent } from './disconnected-bridge-event'

import type { DisconnectingBridgeEvent } from './disconnecting-bridge-event'

import type { MessageBridgeEvent } from './message-bridge-event'

import type { ReconnectingBridgeEvent } from './reconnecting-bridge-event'

export type BridgeEventHandlerMap = {
  connecting: (event: ConnectingBridgeEvent) => unknown
  connected: (event: ConnectedBridgeEvent) => unknown
  disconnecting: (event: DisconnectingBridgeEvent) => unknown
  disconnected: (event: DisconnectedBridgeEvent) => unknown
  reconnecting: (event: ReconnectingBridgeEvent) => unknown
  message: (event: MessageBridgeEvent) => unknown
}
