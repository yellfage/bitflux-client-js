import type { EventChannel } from '@yellfage/events'

import type { MessageBridgeEventHandler } from './message-bridge-event-handler'

export interface MessageBridgeEventChannel
  extends EventChannel<MessageBridgeEventHandler> {}
