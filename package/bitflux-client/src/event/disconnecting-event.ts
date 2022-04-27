import type { ClientEvent } from './client-event'

export interface DisconnectingEvent extends ClientEvent {
  readonly reason: string
}
