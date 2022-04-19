import type { ConnectedBridgeEvent } from './connected-bridge-event'

import type { ConnectingBridgeEvent } from './connecting-bridge-event'

import type { DisconnectedBridgeEvent } from './disconnected-bridge-event'

import type { MessageBridgeEvent } from './message-bridge-event'

import type { ReconnectedBridgeEvent } from './reconnected-bridge-event'

import type { ReconnectingBridgeEvent } from './reconnecting-bridge-event'

import type { TerminatedBridgeEvent } from './terminated-bridge-event'

import type { TerminatingBridgeEvent } from './terminating-bridge-event'

export type BridgeEventHandlerMap = {
  disconnected: (event: DisconnectedBridgeEvent) => unknown
  connecting: (event: ConnectingBridgeEvent) => unknown
  connected: (event: ConnectedBridgeEvent) => unknown
  reconnecting: (event: ReconnectingBridgeEvent) => unknown
  reconnected: (event: ReconnectedBridgeEvent) => unknown
  terminating: (event: TerminatingBridgeEvent) => unknown
  terminated: (event: TerminatedBridgeEvent) => unknown
  message: (event: MessageBridgeEvent) => unknown
}
