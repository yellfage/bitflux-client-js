import type {
  TransportCloseEventHandler,
  TransportMessageEventHandler,
  TransportOpenEventHandler,
} from './event'

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
