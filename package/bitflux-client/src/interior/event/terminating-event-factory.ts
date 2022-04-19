import type { BitfluxClient } from '../../bitflux-client'

import type { TerminatingEvent } from '../../event'

export interface TerminatingEventFactory {
  create(target: BitfluxClient, reason: string): TerminatingEvent
}
