import type { BitfluxClient } from '../../../bitflux-client'

import type { ConnectedEvent } from '../../../event'

import { BasicConnectedEvent } from './basic-connected-event'

import type { ConnectedEventFactory } from './connected-event-factory'

export class BasicConnectedEventFactory implements ConnectedEventFactory {
  public create(target: BitfluxClient): ConnectedEvent {
    return new BasicConnectedEvent(target)
  }
}
