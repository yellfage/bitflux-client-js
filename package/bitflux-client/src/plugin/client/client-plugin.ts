import type { BitfluxClient } from '../../bitflux-client'

export interface ClientPlugin {
  initialize(client: BitfluxClient): void
}
