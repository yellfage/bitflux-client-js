import type { EventPool } from '@yellfage/events'

import type { DisconnectingEventHandler } from './disconnecting-event-handler'

export interface DisconnectingEventPool
  extends EventPool<DisconnectingEventHandler> {}
