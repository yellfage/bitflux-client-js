import type { EventChannel } from '@yellfage/events'

import type { RetryingEventHandler } from '../../../event'

export interface RetryingEventChannel
  extends EventChannel<RetryingEventHandler> {}
