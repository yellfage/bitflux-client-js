import type { DisconnectionCode } from '../../../disconnection-code'

import type { TransportEvent } from '../transport-event'

export interface TransportClosingEvent extends TransportEvent {
  readonly code: DisconnectionCode
  readonly reason: string
}
