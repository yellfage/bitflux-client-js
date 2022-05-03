import type { ClientEvent } from '../client-event'

export interface ReconnectingEvent extends ClientEvent {
  readonly attempts: number
  readonly delay: number
}
