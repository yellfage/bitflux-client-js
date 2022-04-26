import type { TransportMessageEvent } from './transport-message-event'

export type TransportMessageEventHandler = (
  event: TransportMessageEvent,
) => Promise<void> | void
