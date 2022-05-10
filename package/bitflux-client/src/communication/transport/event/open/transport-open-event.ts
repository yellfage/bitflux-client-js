import type { TransportEvent } from '../transport-event'

export interface TransportOpenEvent extends TransportEvent {
  readonly protocol: string | null
}
