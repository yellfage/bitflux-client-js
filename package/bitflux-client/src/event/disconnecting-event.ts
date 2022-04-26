import type { Event } from './event'

export interface DisconnectingEvent extends Event {
  readonly reason: string
}
