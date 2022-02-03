import type { Event } from './event'

export interface ReconnectingEvent extends Event {
  readonly attempts: number
  readonly delay: number
}
