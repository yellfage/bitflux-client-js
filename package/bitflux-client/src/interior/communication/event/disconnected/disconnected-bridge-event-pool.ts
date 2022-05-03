import type { EventPool } from '@yellfage/events'

import type { DisconnectedBridgeEventHandler } from './disconnected-bridge-event-handler'

export interface DisconnectedBridgeEventPool
  extends EventPool<DisconnectedBridgeEventHandler> {}
