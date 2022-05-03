import type { Bridge } from '../../bridge'

import { BasicReconnectingBridgeEvent } from './basic-reconnecting-bridge-event'

import type { ReconnectingBridgeEvent } from './reconnecting-bridge-event'

import type { ReconnectingBridgeEventFactory } from './reconnecting-bridge-event-factory'

export class BasicReconnectingBridgeEventFactory
  implements ReconnectingBridgeEventFactory
{
  public create(
    target: Bridge,
    attempts: number,
    delay: number,
  ): ReconnectingBridgeEvent {
    return new BasicReconnectingBridgeEvent(target, attempts, delay)
  }
}
