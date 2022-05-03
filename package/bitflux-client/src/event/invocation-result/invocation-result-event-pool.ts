import type { EventPool } from '@yellfage/events'

import type { InvocationResultEventHandler } from './invocation-result-event-handler'

export interface InvocationResultEventPool
  extends EventPool<InvocationResultEventHandler> {}
