import type { BitfluxClient } from '../../bitflux-client'

import type { ClientEvent } from '../../event'

export abstract class BasicClientEvent implements ClientEvent {
  public readonly target: BitfluxClient

  public constructor(target: BitfluxClient) {
    this.target = target
  }
}
