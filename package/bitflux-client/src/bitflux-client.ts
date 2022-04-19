import type { EventHandlerMap } from './event'

import type {
  InvocationHandler,
  NotifiableInvocationBuilder,
  RegularInvocationBuilder,
} from './invocation'

import type { PluginBuilder } from './plugin-builder'

import type { State } from './state'

export interface BitfluxClient {
  readonly url: URL
  readonly state: State

  /**
   * @throws {@link AbortError}
   */
  connect(url?: string | URL): Promise<void>
  disconnect(reason?: string): Promise<void>
  terminate(reason?: string): Promise<void>

  use(builder: PluginBuilder)

  map(handlerName: string, handler: InvocationHandler): void

  invoke<TResult>(handlerName: string): RegularInvocationBuilder<TResult>

  notify(handlerName: string): NotifiableInvocationBuilder

  on<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    handler: EventHandlerMap[TEventName],
  ): EventHandlerMap[TEventName]

  off<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    handler: EventHandlerMap[TEventName],
  ): void
}
