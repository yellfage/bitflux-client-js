import type { BitfluxClient } from '../../bitflux-client'

import type { ConnectedEvent } from '../../event'

export interface ConnectedEventFactory {
  create(target: BitfluxClient): ConnectedEvent
}
