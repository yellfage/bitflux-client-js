import type { BitfluxClient } from '../../../bitflux-client'

import type { DisconnectingEvent } from '../../../event'

import { BasicEvent } from '../basic-event'

export class BasicDisconnectingEvent
  extends BasicEvent
  implements DisconnectingEvent
{
  public readonly reason: string

  public constructor(target: BitfluxClient, reason: string) {
    super(target)

    this.reason = reason
  }
}
