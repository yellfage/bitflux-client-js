import type { Bridge } from '../bridge'

import { BasicBridgeEvent } from './basic-bridge-event'

import type { ReconnectingBridgeEvent } from './reconnecting-bridge-event'

export class BasicReconnectingBridgeEvent
  extends BasicBridgeEvent
  implements ReconnectingBridgeEvent
{
  public readonly attempts: number

  public readonly delay: number

  public constructor(target: Bridge, attempts: number, delay: number) {
    super(target)

    this.attempts = attempts
    this.delay = delay
  }
}
