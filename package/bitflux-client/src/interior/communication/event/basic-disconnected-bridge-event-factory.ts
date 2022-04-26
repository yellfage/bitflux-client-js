import type { DisconnectionCode } from '../../../communication'

import type { Bridge } from '../bridge'

import { BasicDisconnectedBridgeEvent } from './basic-disconnected-bridge-event'

import type { DisconnectedBridgeEvent } from './disconnected-bridge-event'

import type { DisconnectedBridgeEventFactory } from './disconnected-bridge-event-factory'

export class BasicDisconnectedBridgeEventFactory
  implements DisconnectedBridgeEventFactory
{
  public create(
    target: Bridge,
    code: DisconnectionCode,
    reason: string,
  ): DisconnectedBridgeEvent {
    return new BasicDisconnectedBridgeEvent(target, code, reason)
  }
}
