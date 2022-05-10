import type {
  TransportClosingEventHandler,
  TransportMessagingEventHandler,
  TransportOpeningEventHandler,
} from './event'

export interface Transport {
  readonly name: string

  onopening: TransportOpeningEventHandler | null
  onclosing: TransportClosingEventHandler | null
  onmessaging: TransportMessagingEventHandler | null

  survey(): boolean

  open(url: URL, protocols: string[]): void
  close(reason?: string): void

  send(message: string): void
}
