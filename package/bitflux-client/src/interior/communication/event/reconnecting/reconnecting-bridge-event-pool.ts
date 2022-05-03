import type { EventPool } from '@yellfage/events'

import type { ReconnectingBridgeEventHandler } from './reconnecting-bridge-event-handler'

export interface ReconnectingBridgeEventPool
  extends EventPool<ReconnectingBridgeEventHandler> {}
