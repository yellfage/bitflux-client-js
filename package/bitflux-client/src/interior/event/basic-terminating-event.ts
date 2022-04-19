import type { BitfluxClient } from '../../bitflux-client'

import type { TerminatingEvent } from '../../event'

import { BasicEvent } from './basic-event'

export class BasicTerminatingEvent
  extends BasicEvent
  implements TerminatingEvent
{
  public readonly reason: string

  public constructor(target: BitfluxClient, reason: string) {
    super(target)

    this.reason = reason
  }
}
