import type { DisconnectionCode } from '../../../communication'

import type { Bridge } from '../bridge'

import type { DisconnectedBridgeEvent } from './disconnected-bridge-event'

export interface DisconnectedBridgeEventFactory {
  create(
    bridge: Bridge,
    code: DisconnectionCode,
    reason: string,
  ): DisconnectedBridgeEvent
}
