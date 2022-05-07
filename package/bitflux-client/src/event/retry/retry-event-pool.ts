import type { EventPool } from '@yellfage/events'

import type { RetryEventHandler } from './retry-event-handler'

export interface RetryEventPool extends EventPool<RetryEventHandler> {}
