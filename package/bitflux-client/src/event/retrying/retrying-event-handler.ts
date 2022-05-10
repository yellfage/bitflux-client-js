import type { RetryingEvent } from './retrying-event'

export type RetryingEventHandler = (event: RetryingEvent) => unknown
