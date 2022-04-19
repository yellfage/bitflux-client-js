import type { BitfluxClient } from '../../bitflux-client'

import type { ReconnectingEvent } from '../../event'

import { BasicEvent } from './basic-event'

export class BasicReconnectingEvent
  extends BasicEvent
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
