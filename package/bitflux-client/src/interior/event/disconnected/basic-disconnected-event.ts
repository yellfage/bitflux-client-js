import type { BitfluxClient } from '../../../bitflux-client'

import type { DisconnectionCode } from '../../../communication'

import type { DisconnectedEvent } from '../../../event'

import { BasicEvent } from '../basic-event'

export class BasicDisconnectedEvent
  extends BasicEvent
  implements DisconnectedEvent
{
  public readonly code: DisconnectionCode

  public readonly reason: string

  public constructor(
    target: BitfluxClient,
    code: DisconnectionCode,
    reason: string,
  ) {
    super(target)

    this.code = code
    this.reason = reason
  }
}
