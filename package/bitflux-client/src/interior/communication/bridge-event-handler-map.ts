import type { BridgeConnectedEvent } from './bridge-connected-event'

import type { BridgeConnectingEvent } from './bridge-connecting-event'

import type { BridgeDisconnectedEvent } from './bridge-disconnected-event'

import type { BridgeMessageEvent } from './bridge-message-event'

import type { BridgeReconnectedEvent } from './bridge-reconnected-event'

import type { BridgeReconnectingEvent } from './bridge-reconnecting-event'

import type { BridgeTerminatedEvent } from './bridge-terminated-event'

import type { BridgeTerminatingEvent } from './bridge-terminating-event'

export type BridgeEventHandlerMap = {
  disconnected: (event: BridgeDisconnectedEvent) => unknown
  connecting: (event: BridgeConnectingEvent) => unknown
  connected: (event: BridgeConnectedEvent) => unknown
  reconnecting: (event: BridgeReconnectingEvent) => unknown
  reconnected: (event: BridgeReconnectedEvent) => unknown
  terminating: (event: BridgeTerminatingEvent) => unknown
  terminated: (event: BridgeTerminatedEvent) => unknown
  message: (event: BridgeMessageEvent) => unknown
}
