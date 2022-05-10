import type { TransportOpeningEvent } from './transport-opening-event'

export type TransportOpeningEventHandler = (
  event: TransportOpeningEvent,
) => Promise<void> | void
