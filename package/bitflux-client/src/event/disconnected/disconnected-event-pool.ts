import type { EventPool } from '@yellfage/events'

import type { DisconnectedEventHandler } from './disconnected-event-handler'

export interface DisconnectedEventPool
  extends EventPool<DisconnectedEventHandler> {}
