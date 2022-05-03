import type { EventPool } from '@yellfage/events'

import type { DisconnectingBridgeEventHandler } from './disconnecting-bridge-event-handler'

export interface DisconnectingBridgeEventPool
  extends EventPool<DisconnectingBridgeEventHandler> {}
