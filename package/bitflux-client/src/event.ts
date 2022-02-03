import type { BitfluxClient } from './bitflux-client'

export interface Event {
  readonly target: BitfluxClient
}
