import type { Bridge } from '../bridge'

import { BasicTerminatingBridgeEvent } from './basic-terminating-bridge-event'

import type { TerminatingBridgeEvent } from './terminating-bridge-event'

import type { TerminatingBridgeEventFactory } from './terminating-bridge-event-factory'

export class BasicTerminatingBridgeEventFactory
  implements TerminatingBridgeEventFactory
{
  public create(bridge: Bridge, reason: string): TerminatingBridgeEvent {
    return new BasicTerminatingBridgeEvent(bridge, reason)
  }
}
