import type { RetryEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicRetryEvent } from './basic-retry-event'

import type { RetryEventFactory } from './retry-event-factory'

export class BasicRetryEventFactory implements RetryEventFactory {
  public create(target: Invocation, delay: number): RetryEvent {
    return new BasicRetryEvent(target, delay)
  }
}
