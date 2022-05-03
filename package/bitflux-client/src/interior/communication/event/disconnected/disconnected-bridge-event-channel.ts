import type { EventChannel } from '@yellfage/events'

import type { DisconnectedBridgeEventHandler } from './disconnected-bridge-event-handler'

export interface DisconnectedBridgeEventChannel
  extends EventChannel<DisconnectedBridgeEventHandler> {}
