import type { EventChannel } from '@yellfage/events'

import type { RetryEventHandler } from '../../../event'

export interface RetryEventChannel extends EventChannel<RetryEventHandler> {}
