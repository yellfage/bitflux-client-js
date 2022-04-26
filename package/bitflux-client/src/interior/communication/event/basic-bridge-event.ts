import type { Bridge } from '../bridge'

import type { BridgeEvent } from './bridge-event'

export abstract class BasicBridgeEvent implements BridgeEvent {
  public readonly target: Bridge

  public constructor(target: Bridge) {
    this.target = target
  }
}
