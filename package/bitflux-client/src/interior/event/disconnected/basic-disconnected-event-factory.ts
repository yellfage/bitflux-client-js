import type { BitfluxClient } from '../../../bitflux-client'

import type { DisconnectionCode } from '../../../communication'

import type { DisconnectedEvent } from '../../../event'

import { BasicDisconnectedEvent } from './basic-disconnected-event'

import type { DisconnectedEventFactory } from './disconnected-event-factory'

export class BasicDisconnectedEventFactory implements DisconnectedEventFactory {
  public create(
    target: BitfluxClient,
    code: DisconnectionCode,
    reason: string,
  ): DisconnectedEvent {
    return new BasicDisconnectedEvent(target, code, reason)
  }
}
