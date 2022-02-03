import type { TransportDisconnectedEvent } from './transport-disconnected-event'

import type { TransportMessageEvent } from './transport-message-event'

export type TransportEventHandlerMap = {
  disconnected: (event: TransportDisconnectedEvent) => unknown
  message: (event: TransportMessageEvent) => unknown
}
