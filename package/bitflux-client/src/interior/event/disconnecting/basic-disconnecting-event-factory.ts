import type { BitfluxClient } from '../../../bitflux-client'

import type { DisconnectingEvent } from '../../../event'

import { BasicDisconnectingEvent } from './basic-disconnecting-event'

import type { DisconnectingEventFactory } from './disconnecting-event-factory'

export class BasicDisconnectingEventFactory
  implements DisconnectingEventFactory
{
  public create(target: BitfluxClient, reason: string): DisconnectingEvent {
    return new BasicDisconnectingEvent(target, reason)
  }
}
