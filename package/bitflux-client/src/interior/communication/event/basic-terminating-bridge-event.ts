import type { Bridge } from '../bridge'

import { BasicBridgeEvent } from './basic-bridge-event'

import type { TerminatingBridgeEvent } from './terminating-bridge-event'

export class BasicTerminatingBridgeEvent
  extends BasicBridgeEvent
  implements TerminatingBridgeEvent
{
  public readonly reason: string

  public constructor(bridge: Bridge, reason: string) {
    super(bridge)

    this.reason = reason
  }
}
