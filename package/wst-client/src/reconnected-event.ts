import type { Event } from './event'

export interface ReconnectedEvent extends Event {
  readonly attempts: number
}
