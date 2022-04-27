import type { ConnectedEvent } from './connected-event'

import type { ConnectingEvent } from './connecting-event'

import type { DisconnectedEvent } from './disconnected-event'

import type { DisconnectingEvent } from './disconnecting-event'

import type { ReconnectingEvent } from './reconnecting-event'

export type ClientEventHandlerMap = {
  connecting: (event: ConnectingEvent) => unknown
  connected: (event: ConnectedEvent) => unknown
  disconnecting: (event: DisconnectingEvent) => unknown
  disconnected: (event: DisconnectedEvent) => unknown
  reconnecting: (event: ReconnectingEvent) => unknown
}
