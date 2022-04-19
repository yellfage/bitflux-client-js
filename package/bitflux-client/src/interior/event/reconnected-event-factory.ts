import type { BitfluxClient } from '../../bitflux-client'

import type { ReconnectedEvent } from '../../event'

export interface ReconnectedEventFactory {
  create(target: BitfluxClient, attempts: number): ReconnectedEvent
}
