import type { TransportEvent } from '../transport-event'

export interface TransportOpeningEvent extends TransportEvent {
  readonly protocol: string | null
}
