import type { BitfluxClient } from '../../bitflux-client'

import type { ReconnectedEvent } from '../../event'

import { BasicReconnectedEvent } from './basic-reconnected-event'

import type { ReconnectedEventFactory } from './reconnected-event-factory'

export class BasicReconnectedEventFactory implements ReconnectedEventFactory {
  public create(target: BitfluxClient, attempts: number): ReconnectedEvent {
    return new BasicReconnectedEvent(target, attempts)
  }
}
