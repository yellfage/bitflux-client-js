import type { EventPool } from '@yellfage/events'

import type { MessageBridgeEventHandler } from './message-bridge-event-handler'

export interface MessageBridgeEventPool
  extends EventPool<MessageBridgeEventHandler> {}
