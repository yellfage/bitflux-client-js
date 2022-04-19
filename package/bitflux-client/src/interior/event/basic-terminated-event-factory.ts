import type { BitfluxClient } from '../../bitflux-client'

import type { TerminatedEvent } from '../../event'

import { BasicTerminatedEvent } from './basic-terminated-event'

import type { TerminatedEventFactory } from './terminated-event-factory'

export class BasicTerminatedEventFactory implements TerminatedEventFactory {
  public create(target: BitfluxClient, reason: string): TerminatedEvent {
    return new BasicTerminatedEvent(target, reason)
  }
}
