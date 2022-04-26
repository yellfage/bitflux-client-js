import type { Bridge } from '../bridge'

import { BasicDisconnectingBridgeEvent } from './basic-disconnecting-bridge-event'

import type { DisconnectingBridgeEvent } from './disconnecting-bridge-event'

import type { DisconnectingBridgeEventFactory } from './disconnecting-bridge-event-factory'

export class BasicDisconnectingBridgeEventFactory
  implements DisconnectingBridgeEventFactory
{
  public create(target: Bridge, reason: string): DisconnectingBridgeEvent {
    return new BasicDisconnectingBridgeEvent(target, reason)
  }
}
