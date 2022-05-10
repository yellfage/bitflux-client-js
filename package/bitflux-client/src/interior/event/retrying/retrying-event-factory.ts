import type { RetryingEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

export interface RetryingEventFactory {
  create(target: Invocation, delay: number): RetryingEvent
}
