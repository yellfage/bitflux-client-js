import { IEventHandlerStore } from './i-event-handler-store'
import { StartingEventHandler } from './starting-event-handler'
import { ConnectingEventHandler } from './connecting-event-handler'
import { ConnectedEventHandler } from './connected-event-handler'
import { ReconnectingEventHandler } from './reconnecting-event-handler'
import { DisconnectedEventHandler } from './disconnected-event-handler'
import { TerminatedEventHandler } from './terminated-event-handler'
import { StartedEventHandler } from './started-event-handler'
import { ReconnectedEventHandler } from './reconnected-event-handler'
import { InvocationEventHandler } from './invocation-event-handler'
import { InvocationCompletionEventHandler } from './invocation-completion-event-handler'
import { IncomingInvocationEventHandler } from './incoming-invocation-event-handler'
import { NotifiableInvocationHandler } from './notifiable-invocation-handler'
import { RegularInvocationSetup } from './regular-invocation-setup'
import { RegularInvocationSetupCallback } from './regular-invocation-setup-callback'
import { NotifiableInvocationSetup } from './notifiable-invocation-setup'
import { NotifiableInvocationSetupCallback } from './notifiable-invocation-setup-callback'

import { ClientState } from './client-state'

export interface IClient {
  readonly url: string
  readonly state: ClientState

  readonly starting: IEventHandlerStore<StartingEventHandler>
  readonly connecting: IEventHandlerStore<ConnectingEventHandler>
  readonly connected: IEventHandlerStore<ConnectedEventHandler>
  readonly reconnecting: IEventHandlerStore<ReconnectingEventHandler>
  readonly disconnected: IEventHandlerStore<DisconnectedEventHandler>
  readonly terminated: IEventHandlerStore<TerminatedEventHandler>

  readonly started: IEventHandlerStore<StartedEventHandler>
  readonly reconnected: IEventHandlerStore<ReconnectedEventHandler>

  readonly invocation: IEventHandlerStore<InvocationEventHandler>

  readonly invocationCompletion: IEventHandlerStore<InvocationCompletionEventHandler>

  readonly incomingInvocation: IEventHandlerStore<IncomingInvocationEventHandler>

  readonly isStarting: boolean
  readonly isConnecting: boolean
  readonly isConnected: boolean
  readonly isReconnecting: boolean
  readonly isDisconnected: boolean
  readonly isTerminated: boolean

  start(url?: string): Promise<void>
  stop(): Promise<void>

  onNotification(
    handlerName: string,
    handler: NotifiableInvocationHandler
  ): void

  offNotification(handlerName: string): void

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
    setup: RegularInvocationSetupCallback<THandlerName, TArgs>
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
  ): Promise<void>

  notify<THandlerName extends string = string, TArgs extends any[] = any[]>(
    setup: NotifiableInvocationSetupCallback<THandlerName, TArgs>
  ): Promise<void>

  notify<THandlerName extends string = string, TArgs extends any[] = any[]>(
    handlerName: THandlerName,
    ...args: TArgs
  ): Promise<void>
}
