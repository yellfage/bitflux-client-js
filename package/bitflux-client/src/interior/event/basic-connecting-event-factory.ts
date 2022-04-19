import type { BitfluxClient } from '../../bitflux-client'

import type { ConnectingEvent } from '../../event'

import { BasicConnectingEvent } from './basic-connecting-event'

import type { ConnectingEventFactory } from './connecting-event-factory'

export class BasicConnectingEventFactory implements ConnectingEventFactory {
  public create(target: BitfluxClient): ConnectingEvent {
    return new BasicConnectingEvent(target)
  }
}
