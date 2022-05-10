import type { EventPool } from '@yellfage/events'

import type { RetryingEventHandler } from './retrying-event-handler'

export interface RetryingEventPool extends EventPool<RetryingEventHandler> {}
