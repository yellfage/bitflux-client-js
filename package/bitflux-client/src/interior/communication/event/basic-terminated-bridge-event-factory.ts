import type { Bridge } from '../bridge'

import { BasicTerminatedBridgeEvent } from './basic-terminated-bridge-event'

import type { TerminatedBridgeEvent } from './terminated-bridge-event'

import type { TerminatedBridgeEventFactory } from './terminated-bridge-event-factory'

export class BasicTerminatedBridgeEventFactory
  implements TerminatedBridgeEventFactory
{
  public create(bridge: Bridge, reason: string): TerminatedBridgeEvent {
    return new BasicTerminatedBridgeEvent(bridge, reason)
  }
}
