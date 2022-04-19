import type { Event } from './event'

export interface TerminatedEvent extends Event {
  readonly reason: string
}
