import { State } from './state'

import { WebSocketEvents } from './web-socket-events'

export interface WebSocketClient {
  readonly url: string
  readonly state: State

  start(url?: string): Promise<void>
  stop(reason?: string): Promise<void>

  send(message: any): void

  on<TEventName extends keyof WebSocketEvents>(
    eventName: TEventName,
    handler: WebSocketEvents[TEventName]
  ): WebSocketEvents[TEventName]

  off<TEventName extends keyof WebSocketEvents>(
    eventName: TEventName,
    handler: WebSocketEvents[TEventName]
  ): void
}
