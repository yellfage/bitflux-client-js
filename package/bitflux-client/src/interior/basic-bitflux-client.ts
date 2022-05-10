import type { BitfluxClient } from '../bitflux-client'

import type { InvocationBuilder, InvocationHandler } from '../invocation'

import type { ClientPluginBuilder } from '../plugin'

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
  InvocatingEventChannel,
  ReconnectingEventChannel,
  ReconnectingEventFactory,
  ReplyingEventChannel,
  RetryingEventChannel,
} from './event'

import type { InvocationBuilderFactory } from './invocation'

import {
  NotifiableInvocationFactory,
  RegularInvocationFactory,
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

  public readonly invocating: InvocatingEventChannel

  public readonly replying: ReplyingEventChannel

  public readonly retrying: RetryingEventChannel

  private readonly connectingEventFactory: ConnectingEventFactory

  private readonly connectedEventFactory: ConnectedEventFactory

  private readonly disconnectingEventFactory: DisconnectingEventFactory

  private readonly disconnectedEventFactory: DisconnectedEventFactory

  private readonly reconnectingEventFactory: ReconnectingEventFactory

  private readonly bridge: Bridge

  private readonly handlerMapper: HandlerMapper

  private readonly invocationBuilderFactory: InvocationBuilderFactory

  public constructor(
    connectingEventChannel: ConnectingEventChannel,
    connectedEventChannel: ConnectedEventChannel,
    disconnectingEventChannel: DisconnectingEventChannel,
    disconnectedEventChannel: DisconnectedEventChannel,
    reconnectingEventChannel: ReconnectingEventChannel,
    invocatingEventChannel: InvocatingEventChannel,
    replyingEventChannel: ReplyingEventChannel,
    retryingEventChannel: RetryingEventChannel,
    connectingEventFactory: ConnectingEventFactory,
    connectedEventFactory: ConnectedEventFactory,
    disconnectingEventFactory: DisconnectingEventFactory,
    disconnectedEventFactory: DisconnectedEventFactory,
    reconnectingEventFactory: ReconnectingEventFactory,
    bridge: Bridge,
    handlerMapper: HandlerMapper,
    invocationBuilderFactory: InvocationBuilderFactory,
  ) {
    this.connecting = connectingEventChannel
    this.connected = connectedEventChannel
    this.disconnecting = disconnectingEventChannel
    this.disconnected = disconnectedEventChannel
    this.reconnecting = reconnectingEventChannel
    this.invocating = invocatingEventChannel
    this.replying = replyingEventChannel
    this.retrying = retryingEventChannel
    this.connectingEventFactory = connectingEventFactory
    this.connectedEventFactory = connectedEventFactory
    this.disconnectingEventFactory = disconnectingEventFactory
    this.disconnectedEventFactory = disconnectedEventFactory
    this.reconnectingEventFactory = reconnectingEventFactory
    this.bridge = bridge
    this.handlerMapper = handlerMapper
    this.invocationBuilderFactory = invocationBuilderFactory

    this.registerBridgeEventHandlers()
  }

  public use(builder: ClientPluginBuilder): this {
    builder.build().initialize(this)

    return this
  }

  public map(handlerName: string, handler: InvocationHandler): this {
    this.handlerMapper.map(handlerName, handler)

    return this
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

  public invoke<TResult>(
    handlerName: string,
    ...args: unknown[]
  ): InvocationBuilder<TResult> {
    return this.invocationBuilderFactory.create(
      new RegularInvocationFactory(handlerName, args),
    )
  }

  public notify(
    handlerName: string,
    ...args: unknown[]
  ): InvocationBuilder<void> {
    return this.invocationBuilderFactory.create(
      new NotifiableInvocationFactory(handlerName, args),
    )
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
