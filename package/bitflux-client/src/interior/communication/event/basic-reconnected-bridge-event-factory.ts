import type { Bridge } from '../bridge'

import { BasicReconnectedBridgeEvent } from './basic-reconnected-bridge-event'

import type { ReconnectedBridgeEvent } from './reconnected-bridge-event'

import type { ReconnectedBridgeEventFactory } from './reconnected-bridge-event-factory'

export class BasicReconnectedBridgeEventFactory
  implements ReconnectedBridgeEventFactory
{
  public create(bridge: Bridge, attempts: number): ReconnectedBridgeEvent {
    return new BasicReconnectedBridgeEvent(bridge, attempts)
  }
}
