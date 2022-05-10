import type { TransportClosingEvent } from './transport-closing-event'

export type TransportClosingEventHandler = (
  event: TransportClosingEvent,
) => Promise<void> | void
