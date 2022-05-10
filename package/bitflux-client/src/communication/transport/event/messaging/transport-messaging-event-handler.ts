import type { TransportMessagingEvent } from './transport-messaging-event'

export type TransportMessagingEventHandler = (
  event: TransportMessagingEvent,
) => Promise<void> | void
