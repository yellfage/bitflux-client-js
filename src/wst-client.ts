import { InvocationHandler } from './invocation-handler'
import { RegularInvocationSetup } from './regular-invocation-setup'
import { NotifiableInvocationSetup } from './notifiable-invocation-setup'
import { PlainObject } from './plain-object'
import { Events } from './events'

export interface WstClient {
  readonly url: string

  start(url?: string): Promise<void>
  stop(reason?: string): Promise<void>

  map(handlerName: string, handler: InvocationHandler): void
  mapObject(obj: PlainObject): void

  invoke<
    TResult = any,
    THandlerName extends string = string,
    TArgs extends any[] = any[]
  >(
    setup: RegularInvocationSetup<THandlerName, TArgs>
  ): Promise<TResult>

  invoke<
    TResult = any,
    THandlerName extends string = string,
    TArgs extends any[] = any[]
  >(
    handlerName: THandlerName,
    ...args: TArgs
  ): Promise<TResult>

  notify<THandlerName extends string = string, TArgs extends any[] = any[]>(
    setup: NotifiableInvocationSetup<THandlerName, TArgs>
  ): void

  notify<THandlerName extends string = string, TArgs extends any[] = any[]>(
    handlerName: THandlerName,
    ...args: TArgs
  ): void

  notifyCarelessly<
    THandlerName extends string = string,
    TArgs extends any[] = any[]
  >(
    setup: NotifiableInvocationSetup<THandlerName, TArgs>
  ): void

  notifyCarelessly<
    THandlerName extends string = string,
    TArgs extends any[] = any[]
  >(
    handlerName: THandlerName,
    ...args: TArgs
  ): void

  on<TEventName extends keyof Events>(
    eventName: TEventName,
    handler: Events[TEventName]
  ): Events[TEventName]

  off<TEventName extends keyof Events>(
    eventName: TEventName,
    handler: Events[TEventName]
  ): void
}
