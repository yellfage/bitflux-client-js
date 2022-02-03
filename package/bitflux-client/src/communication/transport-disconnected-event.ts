import type { DisconnectionCode } from './disconnection-code'

import type { TransportEvent } from './transport-event'

export interface TransportDisconnectedEvent extends TransportEvent {
  readonly code: DisconnectionCode
  readonly reason: string
}
