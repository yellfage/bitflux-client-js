import type { EventPool } from '@yellfage/events'

import type { ConnectingBridgeEventHandler } from './connecting-bridge-event-handler'

export interface ConnectingBridgeEventPool
  extends EventPool<ConnectingBridgeEventHandler> {}
