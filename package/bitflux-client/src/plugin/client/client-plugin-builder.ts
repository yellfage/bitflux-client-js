import type { BitfluxClient } from '../../bitflux-client'

import type { ClientPlugin } from './client-plugin'

export interface ClientPluginBuilder {
  build(client: BitfluxClient): ClientPlugin
}
