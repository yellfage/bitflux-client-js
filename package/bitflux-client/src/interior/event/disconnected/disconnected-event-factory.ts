import type { BitfluxClient } from '../../../bitflux-client'

import type { DisconnectionCode } from '../../../communication'

import type { DisconnectedEvent } from '../../../event'

export interface DisconnectedEventFactory {
  create(
    target: BitfluxClient,
    code: DisconnectionCode,
    reason: string,
  ): DisconnectedEvent
}
