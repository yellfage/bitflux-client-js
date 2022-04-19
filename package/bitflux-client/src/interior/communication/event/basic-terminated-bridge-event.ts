import type { Bridge } from '../bridge'

import { BasicBridgeEvent } from './basic-bridge-event'

import type { TerminatedBridgeEvent } from './terminated-bridge-event'

export class BasicTerminatedBridgeEvent
  extends BasicBridgeEvent
  implements TerminatedBridgeEvent
{
  public readonly reason: string

  public constructor(bridge: Bridge, reason: string) {
    super(bridge)

    this.reason = reason
  }
}
