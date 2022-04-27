import type { BitfluxClient } from '../bitflux-client'

export interface ClientEvent {
  readonly target: BitfluxClient
}
