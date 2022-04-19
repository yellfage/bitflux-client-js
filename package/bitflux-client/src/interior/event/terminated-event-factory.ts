import type { BitfluxClient } from '../../bitflux-client'

import type { TerminatedEvent } from '../../event'

export interface TerminatedEventFactory {
  create(target: BitfluxClient, reason: string): TerminatedEvent
}
