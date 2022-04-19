import type { BitfluxClient } from '../../bitflux-client'

import type { ReconnectedEvent } from '../../event'

import { BasicEvent } from './basic-event'

export class BasicReconnectedEvent
  extends BasicEvent
  implements ReconnectedEvent
{
  public readonly attempts: number

  public constructor(target: BitfluxClient, attempts: number) {
    super(target)

    this.attempts = attempts
  }
}
