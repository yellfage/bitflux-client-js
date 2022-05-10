import type { RetryingEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicRetryingEvent } from './basic-retrying-event'

import type { RetryingEventFactory } from './retrying-event-factory'

export class BasicRetryingEventFactory implements RetryingEventFactory {
  public create(target: Invocation, delay: number): RetryingEvent {
    return new BasicRetryingEvent(target, delay)
  }
}
