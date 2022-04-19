import type { Event } from './event'

export interface TerminatingEvent extends Event {
  readonly reason: string
}
