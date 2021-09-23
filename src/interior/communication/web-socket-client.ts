import type { State } from './state'

import type { WebSocketEventHandlerMap } from './web-socket-event-handler-map'

export interface WebSocketClient {
  readonly url: URL
  readonly state: State

  connect(url?: string): Promise<void>
  reconnect(url?: string): Promise<void>
  hasteReconnection(): void
  resetReconnection(): void
  disconnect(reason?: string): Promise<void>
  terminate(reason?: string): Promise<void>

  send(message: unknown): void

  on<TEventName extends keyof WebSocketEventHandlerMap>(
    eventName: TEventName,
    handler: WebSocketEventHandlerMap[TEventName]
  ): WebSocketEventHandlerMap[TEventName]

  off<TEventName extends keyof WebSocketEventHandlerMap>(
    eventName: TEventName,
    handler: WebSocketEventHandlerMap[TEventName]
  ): void
}
