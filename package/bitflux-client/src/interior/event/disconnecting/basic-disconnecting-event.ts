import type { BitfluxClient } from '../../../bitflux-client'

import type { DisconnectingEvent } from '../../../event'

import { BasicClientEvent } from '../basic-client-event'

export class BasicDisconnectingEvent
  extends BasicClientEvent
  implements DisconnectingEvent
{
  public readonly reason: string

  public constructor(target: BitfluxClient, reason: string) {
    super(target)

    this.reason = reason
  }
}
