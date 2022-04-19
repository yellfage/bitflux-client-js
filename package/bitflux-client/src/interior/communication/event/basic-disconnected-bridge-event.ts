import type { DisconnectionCode } from '../../../communication'

import type { Bridge } from '../bridge'

import { BasicBridgeEvent } from './basic-bridge-event'

import type { DisconnectedBridgeEvent } from './disconnected-bridge-event'

export class BasicDisconnectedBridgeEvent
  extends BasicBridgeEvent
  implements DisconnectedBridgeEvent
{
  public readonly code: DisconnectionCode

  public readonly reason: string

  public constructor(bridge: Bridge, code: DisconnectionCode, reason: string) {
    super(bridge)

    this.code = code
    this.reason = reason
  }
}
