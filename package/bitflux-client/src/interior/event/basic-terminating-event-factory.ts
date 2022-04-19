import type { BitfluxClient } from '../../bitflux-client'

import type { TerminatingEvent } from '../../event'

import { BasicTerminatingEvent } from './basic-terminating-event'

import type { TerminatingEventFactory } from './terminating-event-factory'

export class BasicTerminatingEventFactory implements TerminatingEventFactory {
  public create(target: BitfluxClient, reason: string): TerminatingEvent {
    return new BasicTerminatingEvent(target, reason)
  }
}
