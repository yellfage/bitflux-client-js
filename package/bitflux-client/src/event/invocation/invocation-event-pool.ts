import type { EventPool } from '@yellfage/events'

import type { InvocationEventHandler } from './invocation-event-handler'

export interface InvocationEventPool
  extends EventPool<InvocationEventHandler> {}
