import type { EventEmitter } from '@yellfage/event-emitter'

import type { BitfluxClient } from '../bitflux-client'

import type { EventHandlerMap } from '../event'

import type {
  InvocationHandler,
  NotifiableInvocationBuilder,
  RegularInvocationBuilder,
} from '../invocation'

import type { PluginBuilder } from '../plugin'

import type { State } from '../state'

import type {
  Bridge,
  DisconnectedBridgeEvent,
  DisconnectingBridgeEvent,
  ReconnectingBridgeEvent,
} from './communication'

import type {
  ConnectedEventFactory,
  ConnectingEventFactory,
  DisconnectedEventFactory,
  DisconnectingEventFactory,
  ReconnectingEventFactory,
} from './event'

import type {
  NotifiableInvocationBuilderFactory,
  RegularInvocationBuilderFactory,
} from './invocation'

import type { HandlerMapper } from './mapping'

export class BasicBitfluxClient implements BitfluxClient {
  public get url(): URL {
    return this.bridge.url
  }

  public get state(): State {
    return this.bridge.state
  }

  private readonly bridge: Bridge

  private readonly eventEmitter: EventEmitter<EventHandlerMap>

  private readonly connectingEventFactory: ConnectingEventFactory

  private readonly connectedEventFactory: ConnectedEventFactory

  private readonly disconnectingEventFactory: DisconnectingEventFactory

  private readonly disconnectedEventFactory: DisconnectedEventFactory

  private readonly reconnectingEventFactory: ReconnectingEventFactory

  private readonly handlerMapper: HandlerMapper

  private readonly regularInvocationBuilderFactory: RegularInvocationBuilderFactory

  private readonly notifiableInvocationBuilderFactory: NotifiableInvocationBuilderFactory

  public constructor(
    bridge: Bridge,
    eventEmitter: EventEmitter<EventHandlerMap>,
    connectingEventFactory: ConnectingEventFactory,
    connectedEventFactory: ConnectedEventFactory,
    disconnectingEventFactory: DisconnectingEventFactory,
    disconnectedEventFactory: DisconnectedEventFactory,
    reconnectingEventFactory: ReconnectingEventFactory,
    handlerMapper: HandlerMapper,
    regularInvocationBuilderFactory: RegularInvocationBuilderFactory,
    notifiableInvocationBuilderFactory: NotifiableInvocationBuilderFactory,
  ) {
    this.bridge = bridge
    this.eventEmitter = eventEmitter
    this.connectingEventFactory = connectingEventFactory
    this.connectedEventFactory = connectedEventFactory
    this.disconnectingEventFactory = disconnectingEventFactory
    this.disconnectedEventFactory = disconnectedEventFactory
    this.reconnectingEventFactory = reconnectingEventFactory
    this.handlerMapper = handlerMapper
    this.regularInvocationBuilderFactory = regularInvocationBuilderFactory
    this.notifiableInvocationBuilderFactory = notifiableInvocationBuilderFactory

    this.registerBridgeEventHandlers()
  }

  public connect(url?: string | URL): Promise<void> {
    return this.bridge.connect(url)
  }

  public reconnect(url?: string | URL): Promise<void> {
    return this.bridge.reconnect(url)
  }

  public disconnect(reason?: string): Promise<void> {
    return this.bridge.disconnect(reason)
  }

  public use(builder: PluginBuilder): void {
    builder.build().initialize(this)
  }

  public map(handlerName: string, handler: InvocationHandler): void {
    this.handlerMapper.map(handlerName, handler)
  }

  public invoke<TResult>(
    handlerName: string,
  ): RegularInvocationBuilder<TResult> {
    return this.regularInvocationBuilderFactory.create(handlerName)
  }

  public notify(handlerName: string): NotifiableInvocationBuilder {
    return this.notifiableInvocationBuilderFactory.create(handlerName)
  }

  public on<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    handler: EventHandlerMap[TEventName],
  ): EventHandlerMap[TEventName] {
    return this.eventEmitter.on(eventName, handler)
  }

  public off<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    handler: EventHandlerMap[TEventName],
  ): void {
    this.eventEmitter.off(eventName, handler)
  }

  public emit<TEventName extends keyof EventHandlerMap>(
    eventName: TEventName,
    ...args: Parameters<EventHandlerMap[TEventName]>
  ): Promise<void> {
    return this.eventEmitter.emit(eventName, ...args)
  }

  private registerBridgeEventHandlers(): void {
    this.bridge.on('connecting', this.handleBridgeConnectingEvent)
    this.bridge.on('connected', this.handleBridgeConnectedEvent)
    this.bridge.on('disconnecting', this.handleBridgeDisconnectingEvent)
    this.bridge.on('disconnected', this.handleBridgeDisconnectedEvent)
    this.bridge.on('reconnecting', this.handleBridgeReconnectingEvent)
  }

  private readonly handleBridgeConnectingEvent = (): Promise<void> => {
    const event = this.connectingEventFactory.create(this)

    return this.eventEmitter.emit('connecting', event)
  }

  private readonly handleBridgeConnectedEvent = (): Promise<void> => {
    const event = this.connectedEventFactory.create(this)

    return this.eventEmitter.emit('connected', event)
  }

  private readonly handleBridgeDisconnectingEvent = ({
    reason,
  }: DisconnectingBridgeEvent): Promise<void> => {
    const event = this.disconnectingEventFactory.create(this, reason)

    return this.eventEmitter.emit('disconnecting', event)
  }

  private readonly handleBridgeDisconnectedEvent = ({
    code,
    reason,
  }: DisconnectedBridgeEvent): Promise<void> => {
    const event = this.disconnectedEventFactory.create(this, code, reason)

    return this.eventEmitter.emit('disconnected', event)
  }

  private readonly handleBridgeReconnectingEvent = ({
    attempts,
    delay,
  }: ReconnectingBridgeEvent): Promise<void> => {
    const event = this.reconnectingEventFactory.create(this, attempts, delay)

    return this.eventEmitter.emit('reconnecting', event)
  }
}
