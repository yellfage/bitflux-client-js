import type { BitfluxClient } from '../../bitflux-client'

import type { ReconnectingEvent } from '../../event'

import { BasicReconnectingEvent } from './basic-reconnecting-event'

import type { ReconnectingEventFactory } from './reconnecting-event-factory'

export class BasicReconnectingEventFactory implements ReconnectingEventFactory {
  public create(
    target: BitfluxClient,
    attempts: number,
    delay: number,
  ): ReconnectingEvent {
    return new BasicReconnectingEvent(target, attempts, delay)
  }
}
