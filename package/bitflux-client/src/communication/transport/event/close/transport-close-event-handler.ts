import type { TransportCloseEvent } from './transport-close-event'

export type TransportCloseEventHandler = (
  event: TransportCloseEvent,
) => Promise<void> | void
