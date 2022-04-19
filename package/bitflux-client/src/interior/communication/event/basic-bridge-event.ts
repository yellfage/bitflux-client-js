import type { Bridge } from '../bridge'

import type { BridgeEvent } from './bridge-event'

export abstract class BasicBridgeEvent implements BridgeEvent {
  public readonly bridge: Bridge

  public constructor(bridge: Bridge) {
    this.bridge = bridge
  }
}
