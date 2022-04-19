import type { BitfluxClient } from '../../bitflux-client'

import type { TerminatedEvent } from '../../event'

import { BasicEvent } from './basic-event'

export class BasicTerminatedEvent
  extends BasicEvent
  implements TerminatedEvent
{
  public readonly reason: string

  public constructor(target: BitfluxClient, reason: string) {
    super(target)

    this.reason = reason
  }
}
