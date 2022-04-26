import type { TransportCloseEventHandler } from './transport-close-event-handler'

import type { TransportMessageEventHandler } from './transport-message-event-handler'

import type { TransportOpenEventHandler } from './transport-open-event-handler'

export interface Transport {
  readonly name: string

  onopen: TransportOpenEventHandler | null
  onclose: TransportCloseEventHandler | null
  onmessage: TransportMessageEventHandler | null

  survey(): boolean

  open(url: URL, protocols: string[]): void
  close(reason?: string): void

  send(message: string): void
}
