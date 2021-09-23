import type { State } from './state'

import type { WebSocketEvents } from './web-socket-events'

export interface WebSocketClient {
  readonly url: URL
  readonly state: State

  connect: (url?: string) => Promise<void>
  reconnect: (url?: string) => Promise<void>
  hasteReconnection: () => void
  resetReconnection: () => void
  disconnect: (reason?: string) => Promise<void>
  terminate: (reason?: string) => Promise<void>

  send: (message: unknown) => void

  on: <TEventName extends keyof WebSocketEvents>(
    eventName: TEventName,
    handler: WebSocketEvents[TEventName]
  ) => WebSocketEvents[TEventName]

  off: <TEventName extends keyof WebSocketEvents>(
    eventName: TEventName,
    handler: WebSocketEvents[TEventName]
  ) => void
}
