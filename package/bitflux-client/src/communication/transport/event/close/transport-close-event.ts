import type { DisconnectionCode } from '../../../disconnection-code'

import type { TransportEvent } from '../transport-event'

export interface TransportCloseEvent extends TransportEvent {
  readonly code: DisconnectionCode
  readonly reason: string
}
