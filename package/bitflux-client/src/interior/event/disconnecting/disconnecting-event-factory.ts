import type { BitfluxClient } from '../../../bitflux-client'

import type { DisconnectingEvent } from '../../../event'

export interface DisconnectingEventFactory {
  create(target: BitfluxClient, reason: string): DisconnectingEvent
}
