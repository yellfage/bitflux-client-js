import type { EventHandlerMap } from './event-handler-map'

import type { InvocationHandler } from './invocation-handler'

import type { NotifiableInvocationSetup } from './notifiable-invocation-setup'

import type { PlainObject } from './plain-object'

import type { RegularInvocationSetup } from './regular-invocation-setup'

export interface WstClient {
  readonly url: URL

  connect(url?: string): Promise<void>
  reconnect(url?: string): Promise<void>
  hasteReconnection(): void
  resetReconnection(): void
  disconnect(reason?: string): Promise<void>
  terminate(reason?: string): Promise<void>

  map(handlerName: string, handler: InvocationHandler): void
  mapObject(obj: PlainObject): void

  invoke<
    TResult = unknown,
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    setup: RegularInvocationSetup<THandlerName, TArgs>
  ): Promise<TResult>

  invoke<
    TResult = unknown,
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    handlerName: THandlerName,
    ...args: TArgs
  ): Promise<TResult>

  notify<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    setup: NotifiableInvocationSetup<THandlerName, TArgs>
  ): void

  notify<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    handlerName: THandlerName,
    ...args: TArgs
  ): void

  notifyCarelessly<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    setup: NotifiableInvocationSetup<THandlerName, TArgs>
  ): void

  notifyCarelessly<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    handlerName: THandlerName,
    ...args: TArgs
  ): void

  on<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    handler: EventHandlerMap[TEventName]
  ): EventHandlerMap[TEventName]

  off<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    handler: EventHandlerMap[TEventName]
  ): void
}
