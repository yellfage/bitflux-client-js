import type { EventPool } from '@yellfage/events'

import type { InvocatingEventHandler } from './invocating-event-handler'

export interface InvocatingEventPool
  extends EventPool<InvocatingEventHandler> {}
