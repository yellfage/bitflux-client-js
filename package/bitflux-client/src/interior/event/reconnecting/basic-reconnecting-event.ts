import type { BitfluxClient } from '../../../bitflux-client'

import type { ReconnectingEvent } from '../../../event'

import { BasicClientEvent } from '../basic-client-event'

export class BasicReconnectingEvent
  extends BasicClientEvent
  implements ReconnectingEvent
{
  public readonly attempts: number

  public readonly delay: number

  public constructor(target: BitfluxClient, attempts: number, delay: number) {
    super(target)

    this.attempts = attempts
    this.delay = delay
  }
}
