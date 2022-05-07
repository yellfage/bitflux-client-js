import type { RetryEvent } from './retry-event'

export type RetryEventHandler = (event: RetryEvent) => unknown
