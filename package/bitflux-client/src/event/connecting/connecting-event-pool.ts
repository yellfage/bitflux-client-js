import type { EventPool } from '@yellfage/events'

import type { ConnectingEventHandler } from './connecting-event-handler'

export interface ConnectingEventPool
  extends EventPool<ConnectingEventHandler> {}
