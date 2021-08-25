import { WstClient } from '../wst-client'

import {
  WebSocketClient,
  WebSocketConnectingEvent,
  WebSocketConnectedEvent,
  WebSocketReconnectingEvent,
  WebSocketReconnectedEvent,
  WebSocketDisconnectedEvent,
  WebSocketTerminatingEvent,
  WebSocketTerminatedEvent
} from './communication'

import {
  RegularInvocationSetupValidator,
  NotifiableInvocationSetupValidator
} from './validation'

import { HandlerMapper } from './handler-mapper'
import { EventEmitter } from './event-emitter'
import { InvocationHandler } from '../invocation-handler'
import { RegularInvocationShapeFactory } from './regular-invocation-shape-factory'
import { NotifiableInvocationShapeFactory } from './notifiable-invocation-shape-factory'
import { RegularInvocationFactory } from './regular-invocation-factory'
import { NotifiableInvocationFactory } from './notifiable-invocation-factory'
import { RegularInvocationSetup } from '../regular-invocation-setup'

import { NotifiableInvocationSetup } from '../notifiable-invocation-setup'
import { PlainObject } from '../plain-object'
import { Events } from '../events'

import { FunctionUtils } from './function-utils'
import { ObjectUtils } from './object-utils'
import { StringUtils } from './string-utils'

export class Client implements WstClient {
  public get url(): string {
    return this.webSocket.url
  }

  private readonly webSocket: WebSocketClient
  private readonly handlerMapper: HandlerMapper
  private readonly eventEmitter: EventEmitter<Events>
  private readonly regularInvocationShapeFactory: RegularInvocationShapeFactory
  private readonly notifiableInvocationShapeFactory: NotifiableInvocationShapeFactory
  private readonly regularInvocationFactory: RegularInvocationFactory
  private readonly notifiableInvocationFactory: NotifiableInvocationFactory

  public constructor(
    webSocket: WebSocketClient,
    handlerMapper: HandlerMapper,
    eventEmitter: EventEmitter<Events>,
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

    this.webSocket.on('connecting', this.handleConnectingWebSocketEvent)
    this.webSocket.on('connected', this.handleConnectedWebSocketEvent)
    this.webSocket.on('reconnecting', this.handleReconnectingWebSocketEvent)
    this.webSocket.on('reconnected', this.handleReconnectedWebSocketEvent)
    this.webSocket.on('disconnected', this.handleDisconnectedWebSocketEvent)
    this.webSocket.on('terminating', this.handleTerminatingWebSocketEvent)
    this.webSocket.on('terminated', this.handleTerminatedWebSocketEvent)
  }

  public start(url?: string): Promise<void> {
    return this.webSocket.start(url)
  }

  public stop(reason?: string): Promise<void> {
    return this.webSocket.stop(reason)
  }

  public map(handlerName: string, handler: InvocationHandler): void {
    if (!StringUtils.isString(handlerName)) {
      throw new TypeError(
        'Invalid type of the "handlerName" parameter. Expected type: string'
      )
    }

    if (!FunctionUtils.isFunction(handler)) {
      throw new TypeError(
        'Invalid type of the "handler" parameter. Expected type: function'
      )
    }

    this.mapCore(handlerName, handler)
  }

  public mapObject(obj: PlainObject): void {
    const handlerNames = Object.getOwnPropertyNames(obj).filter((name) =>
      FunctionUtils.isFunction(obj[name])
    )

    handlerNames.forEach((name) => this.map(name, obj[name]))
  }

  public invoke(...args: any[]): Promise<any> {
    if (ObjectUtils.isPlainObject<RegularInvocationSetup>(args[0])) {
      RegularInvocationSetupValidator.validate(args[0])

      return this.invokeCore(args[0])
    } else {
      const setup: RegularInvocationSetup = {
        handlerName: args[0],
        args: args.slice(1)
      }

      return this.invoke(setup)
    }
  }

  public notify(...args: any[]): void {
    if (ObjectUtils.isPlainObject<NotifiableInvocationSetup>(args[0])) {
      NotifiableInvocationSetupValidator.validate(args[0])

      this.notifyCore(args[0])
    } else {
      const setup: NotifiableInvocationSetup = {
        handlerName: args[0],
        args: args.slice(1)
      }

      this.notify(setup)
    }
  }

  public notifyCarelessly(...args: any[]): void {
    if (!this.webSocket.state.isConnected) {
      return
    }

    this.notify(...args)
  }

  public on<TEventName extends keyof Events>(
    eventName: TEventName,
    handler: Events[TEventName]
  ): Events[TEventName] {
    return this.eventEmitter.on(eventName, handler)
  }

  public off<TEventName extends keyof Events>(
    eventName: TEventName,
    handler: Events[TEventName]
  ): void {
    this.eventEmitter.off(eventName, handler)
  }

  private mapCore(handlerName: string, handler: InvocationHandler): void {
    this.handlerMapper.map(handlerName, handler)
  }

  private invokeCore(setup: RegularInvocationSetup): Promise<any> {
    const shape = this.regularInvocationShapeFactory.create(setup)

    return this.regularInvocationFactory.create(shape).perform()
  }

  private notifyCore(setup: NotifiableInvocationSetup): void {
    const shape = this.notifiableInvocationShapeFactory.create(setup)

    this.notifiableInvocationFactory.create(shape).perform()
  }

  private handleConnectingWebSocketEvent = (
    event: WebSocketConnectingEvent
  ): Promise<void> => {
    return this.eventEmitter.emit('connecting', event)
  }

  private handleConnectedWebSocketEvent = (
    event: WebSocketConnectedEvent
  ): Promise<void> => {
    return this.eventEmitter.emit('connected', event)
  }

  private handleReconnectingWebSocketEvent = (
    event: WebSocketReconnectingEvent
  ): Promise<void> => {
    return this.eventEmitter.emit('reconnecting', event)
  }

  private handleReconnectedWebSocketEvent = (
    event: WebSocketReconnectedEvent
  ): Promise<void> => {
    return this.eventEmitter.emit('reconnected', event)
  }

  private handleDisconnectedWebSocketEvent = (
    event: WebSocketDisconnectedEvent
  ): Promise<void> => {
    return this.eventEmitter.emit('disconnected', event)
  }

  private handleTerminatingWebSocketEvent = (
    event: WebSocketTerminatingEvent
  ): Promise<void> => {
    return this.eventEmitter.emit('terminating', event)
  }

  private handleTerminatedWebSocketEvent = (
    event: WebSocketTerminatedEvent
  ): Promise<void> => {
    return this.eventEmitter.emit('terminated', event)
  }
}
