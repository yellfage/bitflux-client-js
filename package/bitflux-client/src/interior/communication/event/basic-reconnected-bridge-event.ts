import type { Bridge } from '../bridge'

import { BasicBridgeEvent } from './basic-bridge-event'

import type { ReconnectedBridgeEvent } from './reconnected-bridge-event'

export class BasicReconnectedBridgeEvent
  extends BasicBridgeEvent
  implements ReconnectedBridgeEvent
{
  public readonly attempts: number

  public constructor(bridge: Bridge, attempts: number) {
    super(bridge)

    this.attempts = attempts
  }
}
