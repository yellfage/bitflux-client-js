import type { ConnectedBridgeEvent } from './connected'

import type { ConnectingBridgeEvent } from './connecting'

import type { DisconnectedBridgeEvent } from './disconnected'

import type { DisconnectingBridgeEvent } from './disconnecting'

import type { MessageBridgeEvent } from './message'

import type { ReconnectingBridgeEvent } from './reconnecting'

export type BridgeEventHandlerMap = {
  connecting: (event: ConnectingBridgeEvent) => unknown
  connected: (event: ConnectedBridgeEvent) => unknown
  disconnecting: (event: DisconnectingBridgeEvent) => unknown
  disconnected: (event: DisconnectedBridgeEvent) => unknown
  reconnecting: (event: ReconnectingBridgeEvent) => unknown
  message: (event: MessageBridgeEvent) => unknown
}
