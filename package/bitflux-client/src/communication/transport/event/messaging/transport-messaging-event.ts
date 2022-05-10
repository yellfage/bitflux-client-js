import type { TransportEvent } from '../transport-event'

export interface TransportMessagingEvent extends TransportEvent {
  message: string | Blob
}
