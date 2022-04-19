import type { BitfluxClient } from '../../bitflux-client'

import type { Event } from '../../event'

export abstract class BasicEvent implements Event {
  public readonly target: BitfluxClient

  public constructor(target: BitfluxClient) {
    this.target = target
  }
}
