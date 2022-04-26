import type { BitfluxClient } from '../../../bitflux-client'

import type { ConnectingEvent } from '../../../event'

export interface ConnectingEventFactory {
  create(target: BitfluxClient): ConnectingEvent
}
