import type { BitfluxClient } from '../bitflux-client'

export interface Plugin {
  initialize(client: BitfluxClient): void
}
