import type { Bridge } from '../../bridge'

import { BasicBridgeEvent } from '../basic-bridge-event'

import type { DisconnectingBridgeEvent } from './disconnecting-bridge-event'

export class BasicDisconnectingBridgeEvent
  extends BasicBridgeEvent
  implements DisconnectingBridgeEvent
{
  public readonly reason: string

  public constructor(target: Bridge, reason: string) {
    super(target)

    this.reason = reason
  }
}
