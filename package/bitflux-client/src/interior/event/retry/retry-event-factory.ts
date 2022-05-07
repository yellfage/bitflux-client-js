import type { RetryEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

export interface RetryEventFactory {
  create(target: Invocation, delay: number): RetryEvent
}
