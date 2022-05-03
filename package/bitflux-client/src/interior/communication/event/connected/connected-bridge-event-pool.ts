import type { EventPool } from '@yellfage/events'

import type { ConnectedBridgeEventHandler } from './connected-bridge-event-handler'

export interface ConnectedBridgeEventPool
  extends EventPool<ConnectedBridgeEventHandler> {}
