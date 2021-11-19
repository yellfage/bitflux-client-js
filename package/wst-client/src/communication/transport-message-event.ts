import type { TransportEvent } from './transport-event'

export interface TransportMessageEvent extends TransportEvent {
  message: string | Blob
}
