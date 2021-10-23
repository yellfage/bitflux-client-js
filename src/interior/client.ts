import type { EventHandlerMap } from '../event-handler-map'

import type { InvocationHandler } from '../invocation-handler'

import type { NotifiableInvocationSetup } from '../notifiable-invocation-setup'

import type { PlainObject } from '../plain-object'

import type { RegularInvocationSetup } from '../regular-invocation-setup'

import type { State } from '../state'

import type { WstClient } from '../wst-client'

import type { WebSocketClient } from './communication'

import type { EventEmitter } from './event-emitter'

import { isFunction } from './function-utils'

import type { HandlerMapper } from './handler-mapper'

import type { NotifiableInvocationFactory } from './notifiable-invocation-factory'

import type { NotifiableInvocationShapeFactory } from './notifiable-invocation-shape-factory'

import { isPlainObject } from './object-utils'

import type { RegularInvocationFactory } from './regular-invocation-factory'

import type { RegularInvocationShapeFactory } from './regular-invocation-shape-factory'

import { isString } from './string-utils'

import {
  validateRegularInvocationSetup,
  validateNotifiableInvocationSetup
} from './validation'

export class Client implements WstClient {
  public get url(): URL {
    return this.webSocket.url
  }

  public get state(): State {
    return this.webSocket.state
  }

  private readonly webSocket: WebSocketClient

  private readonly handlerMapper: HandlerMapper

  private readonly eventEmitter: EventEmitter<EventHandlerMap>

  private readonly regularInvocationShapeFactory: RegularInvocationShapeFactory

  private readonly notifiableInvocationShapeFactory: NotifiableInvocationShapeFactory

  private readonly regularInvocationFactory: RegularInvocationFactory

  private readonly notifiableInvocationFactory: NotifiableInvocationFactory

  public constructor(
    webSocket: WebSocketClient,
    handlerMapper: HandlerMapper,
    eventEmitter: EventEmitter<EventHandlerMap>,
    regularInvocationShapeFactory: RegularInvocationShapeFactory,
    notifiableInvocationShapeFactory: NotifiableInvocationShapeFactory,
    regularInvocationFactory: RegularInvocationFactory,
    notifiableInvocationFactory: NotifiableInvocationFactory
  ) {
    this.webSocket = webSocket
    this.handlerMapper = handlerMapper
    this.eventEmitter = eventEmitter
    this.regularInvocationShapeFactory = regularInvocationShapeFactory
    this.notifiableInvocationShapeFactory = notifiableInvocationShapeFactory
    this.regularInvocationFactory = regularInvocationFactory
    this.notifiableInvocationFactory = notifiableInvocationFactory
  }

  public async connect(url?: string): Promise<void> {
    return this.webSocket.connect(url)
  }

  public async reconnect(url?: string): Promise<void> {
    return this.webSocket.reconnect(url)
  }

  public hasteReconnection(): void {
    this.webSocket.hasteReconnection()
  }

  public resetReconnection(): void {
    this.webSocket.resetReconnection()
  }

  public async disconnect(reason?: string): Promise<void> {
    return this.webSocket.disconnect(reason)
  }

  public async terminate(reason?: string): Promise<void> {
    return this.webSocket.terminate(reason)
  }

  public map(handlerName: string, handler: InvocationHandler): void {
    if (!isString(handlerName)) {
      throw new TypeError(
        'Invalid type of the "handlerName" parameter. Expected type: string'
      )
    }

    if (!isFunction(handler)) {
      throw new TypeError(
        'Invalid type of the "handler" parameter. Expected type: function'
      )
    }

    this.mapCore(handlerName, handler)
  }

  public mapObject(obj: PlainObject): void {
    const handlerNames = Object.getOwnPropertyNames(obj).filter((name) =>
      isFunction(obj[name])
    )

    handlerNames.forEach((name) =>
      this.map(name, obj[name] as InvocationHandler)
    )
  }

  public invoke<
    TResult = unknown,
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(setup: RegularInvocationSetup<THandlerName, TArgs>): Promise<TResult>

  public invoke<
    TResult = unknown,
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(handlerName: THandlerName, ...args: TArgs): Promise<TResult>

  public async invoke(...args: unknown[]): Promise<unknown> {
    if (isPlainObject<RegularInvocationSetup>(args[0])) {
      validateRegularInvocationSetup(args[0])

      return this.invokeCore(args[0])
    }

    if (!isString(args[0])) {
      throw new Error(
        'Invalid regular invocation arguments: the "handlerName" argument must be a string'
      )
    }

    const setup: RegularInvocationSetup = {
      handlerName: args[0],
      args: args.slice(1)
    }

    return this.invoke(setup)
  }

  public notify<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(setup: NotifiableInvocationSetup<THandlerName, TArgs>): void

  public notify<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(handlerName: THandlerName, ...args: TArgs): void

  public notify(...args: unknown[]): void

  public notify(...args: unknown[]): void {
    if (isPlainObject<NotifiableInvocationSetup>(args[0])) {
      validateNotifiableInvocationSetup(args[0])

      this.notifyCore(args[0])
    } else {
      if (!isString(args[0])) {
        throw new Error(
          'Invalid notifiable invocation arguments: the "handlerName" argument must be a string'
        )
      }

      const setup: NotifiableInvocationSetup = {
        handlerName: args[0],
        args: args.slice(1)
      }

      this.notify(setup)
    }
  }

  public notifyCarelessly<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(setup: NotifiableInvocationSetup<THandlerName, TArgs>): void

  public notifyCarelessly<
    THandlerName extends string = string,
    TArgs extends unknown[] = unknown[]
  >(handlerName: THandlerName, ...args: TArgs): void

  public notifyCarelessly(...args: unknown[]): void {
    if (!this.webSocket.state.isConnected) {
      return
    }

    this.notify(...args)
  }

  public on<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    handler: EventHandlerMap[TEventName]
  ): EventHandlerMap[TEventName] {
    return this.eventEmitter.on(eventName, handler)
  }

  public off<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    handler: EventHandlerMap[TEventName]
  ): void {
    this.eventEmitter.off(eventName, handler)
  }

  private mapCore(handlerName: string, handler: InvocationHandler): void {
    this.handlerMapper.map(handlerName, handler)
  }

  private async invokeCore(setup: RegularInvocationSetup): Promise<unknown> {
    const shape = this.regularInvocationShapeFactory.create(setup)

    return this.regularInvocationFactory.create(shape).perform()
  }

  private notifyCore(setup: NotifiableInvocationSetup): void {
    const shape = this.notifiableInvocationShapeFactory.create(setup)

    this.notifiableInvocationFactory.create(shape).perform()
  }
}
