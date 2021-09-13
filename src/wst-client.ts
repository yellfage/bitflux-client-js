import type { Events } from './events'

import type { InvocationHandler } from './invocation-handler'

import type { NotifiableInvocationSetup } from './notifiable-invocation-setup'

import type { PlainObject } from './plain-object'

import type { RegularInvocationSetup } from './regular-invocation-setup'

export interface WstClient {
  readonly url: string

  start: (url?: string) => Promise<void>
  restart: (url?: string) => Promise<void>
  stop: (reason?: string) => Promise<void>

  map: (handlerName: string, handler: InvocationHandler) => void
  mapObject: (obj: PlainObject) => void

  invoke: (<
    TResult = unknown,
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    setup: RegularInvocationSetup<THandlerName, TArgs>
  ) => Promise<TResult>) &
    (<
      TResult = unknown,
      THandlerName extends string = string,
      TArgs extends unknown[] = unknown[]
    >(
      handlerName: THandlerName,
      ...args: TArgs
    ) => Promise<TResult>)

  notify: (<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    setup: NotifiableInvocationSetup<THandlerName, TArgs>
  ) => void) &
    (<
      THandlerName extends string = string,
      TArgs extends unknown[] = unknown[]
    >(
      handlerName: THandlerName,
      ...args: TArgs
    ) => void)

  notifyCarelessly: (<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(
    setup: NotifiableInvocationSetup<THandlerName, TArgs>
  ) => void) &
    (<
      THandlerName extends string = string,
      TArgs extends unknown[] = unknown[]
    >(
      handlerName: THandlerName,
      ...args: TArgs
    ) => void)

  on: <TEventName extends keyof Events>(
    eventName: TEventName,
    handler: Events[TEventName]
  ) => Events[TEventName]

  off: <TEventName extends keyof Events>(
    eventName: TEventName,
    handler: Events[TEventName]
  ) => void
}
