import type { Bridge } from '../../bridge'

import { BasicConnectedBridgeEvent } from './basic-connected-bridge-event'

import type { ConnectedBridgeEvent } from './connected-bridge-event'

import type { ConnectedBridgeEventFactory } from './connected-bridge-event-factory'

export class BasicConnectedBridgeEventFactory
  implements ConnectedBridgeEventFactory
{
  public create(target: Bridge): ConnectedBridgeEvent {
    return new BasicConnectedBridgeEvent(target)
  }
}
