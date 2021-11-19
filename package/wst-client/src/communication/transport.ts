import type { TransportEventHandlerMap } from './transport-event-handler-map'

export interface Transport {
  readonly name: string

  survey(): boolean

  connect(url: URL): Promise<void>
  disconnect(reason?: string): Promise<void>

  send(message: string): void

  on<TEventName extends keyof TransportEventHandlerMap>(
    eventName: TEventName,
    handler: TransportEventHandlerMap[TEventName]
  ): TransportEventHandlerMap[TEventName]

  off<TEventName extends keyof TransportEventHandlerMap>(
    eventName: TEventName,
    handler: TransportEventHandlerMap[TEventName]
  ): void
}
