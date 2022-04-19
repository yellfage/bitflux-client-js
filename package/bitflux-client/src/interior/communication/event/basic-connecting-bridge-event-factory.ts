import type { Bridge } from '../bridge'

import { BasicConnectingBridgeEvent } from './basic-connecting-bridge-event'

import type { ConnectingBridgeEvent } from './connecting-bridge-event'

import type { ConnectingBridgeEventFactory } from './connecting-bridge-event-factory'

export class BasicConnectingBridgeEventFactory
  implements ConnectingBridgeEventFactory
{
  public create(bridge: Bridge): ConnectingBridgeEvent {
    return new BasicConnectingBridgeEvent(bridge)
  }
}
