import type { BitfluxClient } from '../bitflux-client'

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
  ConnectedEventChannel,
  ConnectedEventFactory,
  ConnectingEventChannel,
  ConnectingEventFactory,
  DisconnectedEventChannel,
  DisconnectedEventFactory,
  DisconnectingEventChannel,
  DisconnectingEventFactory,
  InvocationEventChannel,
  InvocationResultEventChannel,
  ReconnectingEventChannel,
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

  public readonly connecting: ConnectingEventChannel

  public readonly connected: ConnectedEventChannel

  public readonly disconnecting: DisconnectingEventChannel

  public readonly disconnected: DisconnectedEventChannel

  public readonly reconnecting: ReconnectingEventChannel

  public readonly invocation: InvocationEventChannel

  public readonly invocationResult: InvocationResultEventChannel

  private readonly connectingEventFactory: ConnectingEventFactory

  private readonly connectedEventFactory: ConnectedEventFactory

  private readonly disconnectingEventFactory: DisconnectingEventFactory

  private readonly disconnectedEventFactory: DisconnectedEventFactory

  private readonly reconnectingEventFactory: ReconnectingEventFactory

  private readonly bridge: Bridge

  private readonly handlerMapper: HandlerMapper

  private readonly regularInvocationBuilderFactory: RegularInvocationBuilderFactory

  private readonly notifiableInvocationBuilderFactory: NotifiableInvocationBuilderFactory

  public constructor(
    connectingEventChannel: ConnectingEventChannel,
    connectedEventChannel: ConnectedEventChannel,
    disconnectingEventChannel: DisconnectingEventChannel,
    disconnectedEventChannel: DisconnectedEventChannel,
    reconnectingEventChannel: ReconnectingEventChannel,
    invocationEventChannel: InvocationEventChannel,
    invocationResultEventChannel: InvocationResultEventChannel,
    connectingEventFactory: ConnectingEventFactory,
    connectedEventFactory: ConnectedEventFactory,
    disconnectingEventFactory: DisconnectingEventFactory,
    disconnectedEventFactory: DisconnectedEventFactory,
    reconnectingEventFactory: ReconnectingEventFactory,
    bridge: Bridge,
    handlerMapper: HandlerMapper,
    regularInvocationBuilderFactory: RegularInvocationBuilderFactory,
    notifiableInvocationBuilderFactory: NotifiableInvocationBuilderFactory,
  ) {
    this.connecting = connectingEventChannel
    this.connected = connectedEventChannel
    this.disconnecting = disconnectingEventChannel
    this.disconnected = disconnectedEventChannel
    this.reconnecting = reconnectingEventChannel
    this.invocation = invocationEventChannel
    this.invocationResult = invocationResultEventChannel
    this.connectingEventFactory = connectingEventFactory
    this.connectedEventFactory = connectedEventFactory
    this.disconnectingEventFactory = disconnectingEventFactory
    this.disconnectedEventFactory = disconnectedEventFactory
    this.reconnectingEventFactory = reconnectingEventFactory
    this.bridge = bridge
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

  private registerBridgeEventHandlers(): void {
    this.bridge.connecting.add(this.handleBridgeConnectingEvent)
    this.bridge.connected.add(this.handleBridgeConnectedEvent)
    this.bridge.disconnecting.add(this.handleBridgeDisconnectingEvent)
    this.bridge.disconnected.add(this.handleBridgeDisconnectedEvent)
    this.bridge.reconnecting.add(this.handleBridgeReconnectingEvent)
  }

  private readonly handleBridgeConnectingEvent = (): Promise<void> => {
    const event = this.connectingEventFactory.create(this)

    return this.connecting.emit(event)
  }

  private readonly handleBridgeConnectedEvent = (): Promise<void> => {
    const event = this.connectedEventFactory.create(this)

    return this.connected.emit(event)
  }

  private readonly handleBridgeDisconnectingEvent = ({
    reason,
  }: DisconnectingBridgeEvent): Promise<void> => {
    const event = this.disconnectingEventFactory.create(this, reason)

    return this.disconnecting.emit(event)
  }

  private readonly handleBridgeDisconnectedEvent = ({
    code,
    reason,
  }: DisconnectedBridgeEvent): Promise<void> => {
    const event = this.disconnectedEventFactory.create(this, code, reason)

    return this.disconnected.emit(event)
  }

  private readonly handleBridgeReconnectingEvent = ({
    attempts,
    delay,
  }: ReconnectingBridgeEvent): Promise<void> => {
    const event = this.reconnectingEventFactory.create(this, attempts, delay)

    return this.reconnecting.emit(event)
  }
}
