import type { EventPool } from '@yellfage/events'

import type { ReconnectingEventHandler } from './reconnecting-event-handler'

export interface ReconnectingEventPool
  extends EventPool<ReconnectingEventHandler> {}
