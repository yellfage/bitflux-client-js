import type { BitfluxClient } from '../../bitflux-client'

import type { ReconnectingEvent } from '../../event'

export interface ReconnectingEventFactory {
  create(
    target: BitfluxClient,
    attempts: number,
    delay: number,
  ): ReconnectingEvent
}
