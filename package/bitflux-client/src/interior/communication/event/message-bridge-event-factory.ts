import type { IncomingMessage } from '../../../communication'

import type { Bridge } from '../bridge'

import type { MessageBridgeEvent } from './message-bridge-event'

export interface MessageBridgeEventFactory {
  create(target: Bridge, message: IncomingMessage): MessageBridgeEvent
}
