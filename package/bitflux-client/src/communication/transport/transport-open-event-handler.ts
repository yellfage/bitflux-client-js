import type { TransportOpenEvent } from './transport-open-event'

export type TransportOpenEventHandler = (
  event: TransportOpenEvent,
) => Promise<void> | void
