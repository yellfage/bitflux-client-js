import delay from 'delay'

import { AbortError } from '../../abort-error'

import { DisconnectionCode } from '../../communication'

import type {
  OutgoingMessage,
  TransportMessageEvent,
  Transport,
  Protocol,
  TransportCloseEvent,
  TransportOpenEvent,
} from '../../communication'

import type { Logger } from '../../logging'

import type {
  ReconnectionControl,
  ReconnectionDelayScheme,
} from '../../reconnection'

import { DeferredPromise } from '../deferred-promise'

import type { MutableState } from '../mutable-state'

import type { Bridge } from './bridge'

import { EmptyProtocol } from './empty-protocol'

import { EmptyTransport } from './empty-transport'

import type {
  ConnectedBridgeEventChannel,
  ConnectedBridgeEventFactory,
  ConnectingBridgeEventChannel,
  ConnectingBridgeEventFactory,
  DisconnectedBridgeEventChannel,
  DisconnectedBridgeEventFactory,
  DisconnectingBridgeEventChannel,
  DisconnectingBridgeEventFactory,
  MessageBridgeEventChannel,
  MessageBridgeEventFactory,
  ReconnectingBridgeEventChannel,
  ReconnectingBridgeEventFactory,
} from './event'

const TRANSPORT_PARAM_NAME = 'transport'

const EMPTY_TRANSPORT = new EmptyTransport()
const EMPTY_PROTOCOL = new EmptyProtocol()

export class BasicBridge implements Bridge {
  public url: URL

  public readonly state: MutableState

  public readonly connecting: ConnectingBridgeEventChannel

  public readonly connected: ConnectedBridgeEventChannel

  public readonly disconnecting: DisconnectingBridgeEventChannel

  public readonly disconnected: DisconnectedBridgeEventChannel

  public readonly reconnecting: ReconnectingBridgeEventChannel

  public readonly message: MessageBridgeEventChannel

  private readonly connectingEventFactory: ConnectingBridgeEventFactory

  private readonly connectedEventFactory: ConnectedBridgeEventFactory

  private readonly disconnectingEventFactory: DisconnectingBridgeEventFactory

  private readonly disconnectedEventFactory: DisconnectedBridgeEventFactory

  private readonly reconnectingEventFactory: ReconnectingBridgeEventFactory

  private readonly messageEventFactory: MessageBridgeEventFactory

  private readonly transports: Transport[]

  private readonly protocols: Protocol[]

  private readonly reconnectionControl: ReconnectionControl

  private readonly reconnectionDelayScheme: ReconnectionDelayScheme

  private readonly logger: Logger

  private readonly cachedMessages = new Set<OutgoingMessage>()

  private connectionDeferredPromise: DeferredPromise<void> | null = null

  private disconnectionDeferredPromise: DeferredPromise<void> | null = null

  private transport: Transport = EMPTY_TRANSPORT

  private protocol: Protocol = EMPTY_PROTOCOL

  private reconnectionAttempts = 0

  private reconnectionAbortController = new AbortController()

  public constructor(
    url: URL,
    state: MutableState,
    connectingEventChannel: ConnectingBridgeEventChannel,
    connectedEventChannel: ConnectedBridgeEventChannel,
    disconnectingEventChannel: DisconnectingBridgeEventChannel,
    disconnectedEventChannel: DisconnectedBridgeEventChannel,
    reconnectingEventChannel: ReconnectingBridgeEventChannel,
    messageEventChannel: MessageBridgeEventChannel,
    connectingEventFactory: ConnectingBridgeEventFactory,
    connectedEventFactory: ConnectedBridgeEventFactory,
    disconnectingEventFactory: DisconnectingBridgeEventFactory,
    disconnectedEventFactory: DisconnectedBridgeEventFactory,
    reconnectingEventFactory: ReconnectingBridgeEventFactory,
    messageEventFactory: MessageBridgeEventFactory,
    transports: Transport[],
    protocols: Protocol[],
    reconnectionControl: ReconnectionControl,
    reconnectionDelayScheme: ReconnectionDelayScheme,
    logger: Logger,
  ) {
    this.url = url
    this.state = state
    this.connecting = connectingEventChannel
    this.connected = connectedEventChannel
    this.disconnecting = disconnectingEventChannel
    this.disconnected = disconnectedEventChannel
    this.reconnecting = reconnectingEventChannel
    this.message = messageEventChannel
    this.connectingEventFactory = connectingEventFactory
    this.connectedEventFactory = connectedEventFactory
    this.disconnectingEventFactory = disconnectingEventFactory
    this.disconnectedEventFactory = disconnectedEventFactory
    this.reconnectingEventFactory = reconnectingEventFactory
    this.messageEventFactory = messageEventFactory
    this.transports = transports
    this.protocols = protocols
    this.reconnectionControl = reconnectionControl
    this.reconnectionDelayScheme = reconnectionDelayScheme
    this.logger = logger
  }

  /**
   * @throws {@link AbortError}
   */
  public async connect(url: string | URL = this.url): Promise<void> {
    if (!this.state.isDisconnected && !this.state.isReconnecting) {
      throw new Error(
        `Unable to connect at the current state: ${this.state.currentName}`,
      )
    }

    if (url.toString() !== this.url.toString()) {
      this.url = new URL(url)
    }

    if (this.state.isReconnecting) {
      this.abortReconnection()
    }

    this.state.setConnecting()

    const connectingEvent = this.connectingEventFactory.create(this)

    await this.connecting.emit(connectingEvent)

    if (!this.state.isConnecting) {
      throw new AbortError('Connection has been aborted')
    }

    this.transport = this.resolveFirstAvailableTransport()

    this.registerTransportEvents()

    this.setUrlConnectionParams()

    const protocolNames = this.resolveProtocolNames()

    this.transport.open(this.url, protocolNames)

    if (!this.connectionDeferredPromise) {
      this.connectionDeferredPromise = new DeferredPromise()
    }

    return this.connectionDeferredPromise.promise
  }

  public async reconnect(url: string | URL = this.url): Promise<void> {
    if (this.state.isConnecting) {
      this.transport.close()

      return this.connect(url)
    }

    if (this.state.isConnected) {
      await this.disconnect()

      return this.connect(url)
    }

    this.reconnectionAttempts += 1

    if (this.state.isReconnecting) {
      this.abortReconnection()
      this.resetReconnectionDelay()
    } else {
      const attemptDelay = this.reconnectionDelayScheme.moveNext()

      this.state.setReconnecting()

      const reconnectingEvent = this.reconnectingEventFactory.create(
        this,
        this.reconnectionAttempts,
        attemptDelay,
      )

      await this.reconnecting.emit(reconnectingEvent)

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!this.state.isReconnecting) {
        throw new AbortError('Reconnection has been aborted')
      }

      if (this.reconnectionAbortController.signal.aborted) {
        this.reconnectionAbortController = new AbortController()
      }

      try {
        await delay(attemptDelay, {
          signal: this.reconnectionAbortController.signal,
        })
      } catch (error: unknown) {
        if (this.reconnectionAbortController.signal.aborted) {
          throw new AbortError('Reconnection has been aborted')
        }

        throw error
      }
    }

    await this.connect()

    this.resetReconnection()
  }

  public async disconnect(reason = ''): Promise<void> {
    if (this.state.isDisconnecting || this.state.isDisconnected) {
      throw new Error(
        `Unable to disconnect at the current state: ${this.state.currentName}`,
      )
    }

    const wasReconnecting = this.state.isReconnecting

    this.state.setDisconnecting()

    const disconnectingEvent = this.disconnectingEventFactory.create(
      this,
      reason,
    )

    await this.disconnecting.emit(disconnectingEvent)

    this.clearCachedMessages()

    if (wasReconnecting) {
      this.abortReconnection()
      this.resetReconnection()
    } else {
      this.transport.close(reason)
    }

    if (!this.disconnectionDeferredPromise) {
      this.disconnectionDeferredPromise = new DeferredPromise()
    }

    return this.disconnectionDeferredPromise.promise
  }

  public send(message: OutgoingMessage): void {
    if (!this.state.isConnected) {
      this.cachedMessages.add(message)

      return
    }

    this.transport.send(this.protocol.serialize(message))
  }

  private resolveFirstAvailableTransport(): Transport {
    const transports = this.resolveAvailableTransports()

    if (!transports.length) {
      throw new Error(
        'The provided transports are not supported in the current environment',
      )
    }

    const [transport] = transports

    return transport
  }

  private resolveAvailableTransports(): Transport[] {
    return this.transports.filter((transport) => transport.survey())
  }

  private resolveProtocolNames(): string[] {
    return this.protocols.map(({ name }) => name)
  }

  private resolveProtocol(targetName: string): Protocol {
    const protocol = this.protocols.find(({ name }) => name === targetName)

    if (!protocol) {
      throw new Error(`A protocol with the '${targetName}' name not found`)
    }

    return protocol
  }

  private resolveConnectionPromise(): void {
    this.connectionDeferredPromise?.resolve()

    this.connectionDeferredPromise = null
  }

  private rejectConnectionPromise(error: Error): void {
    this.connectionDeferredPromise?.reject(error)

    this.connectionDeferredPromise = null
  }

  private resolveDisconnectionPromise(): void {
    this.disconnectionDeferredPromise?.resolve()

    this.disconnectionDeferredPromise = null
  }

  private rejectDisconnectionPromise(error: Error): void {
    this.disconnectionDeferredPromise?.reject(error)

    this.disconnectionDeferredPromise = null
  }

  private releaseCachedMessages(): void {
    this.sendCachedMessages()
    this.clearCachedMessages()
  }

  private sendCachedMessages(): void {
    this.cachedMessages.forEach((message) => this.send(message))
  }

  private clearCachedMessages(): void {
    this.cachedMessages.clear()
  }

  private abortReconnection(): void {
    this.reconnectionAbortController.abort()
  }

  private resetReconnection(): void {
    this.resetReconnectionAttempts()
    this.resetReconnectionDelay()
  }

  private resetReconnectionAttempts(): void {
    this.reconnectionAttempts = 0
  }

  private resetReconnectionDelay(): void {
    this.reconnectionDelayScheme.reset()
  }

  private resetTransport(): void {
    this.transport = EMPTY_TRANSPORT
  }

  private resetProtocol(): void {
    this.protocol = EMPTY_PROTOCOL
  }

  private registerTransportEvents(): void {
    this.transport.onopen = this.handleOpenEvent
    this.transport.onclose = this.handleCloseEvent
    this.transport.onmessage = this.handleMessageEvent
  }

  private unregisterTransportEvents(): void {
    this.transport.onopen = null
    this.transport.onclose = null
    this.transport.onmessage = null
  }

  private setUrlConnectionParams(): void {
    this.url.searchParams.set(TRANSPORT_PARAM_NAME, this.transport.name)
  }

  private deleteUrlConnectionParams(): void {
    this.url.searchParams.delete(TRANSPORT_PARAM_NAME)
  }

  private confirmReconnection(code: DisconnectionCode): boolean {
    return (
      code === DisconnectionCode.Abnormal &&
      this.reconnectionControl.confirm({ attempts: this.reconnectionAttempts })
    )
  }

  private readonly handleOpenEvent = async ({
    protocol: protocolName,
  }: TransportOpenEvent): Promise<void> => {
    if (protocolName == null) {
      this.rejectConnectionPromise(
        new Error(
          'The provided protocols are not supported on the server side',
        ),
      )

      return
    }

    this.protocol = this.resolveProtocol(protocolName)

    this.state.setConnected()

    const connectedEvent = this.connectedEventFactory.create(this)

    await this.connected.emit(connectedEvent)

    if (!this.state.isConnected) {
      this.rejectConnectionPromise(
        new AbortError('Connection has been aborted'),
      )

      return
    }

    // We need to release cached messages only after the "connected" state is setted
    // Otherwise, the cached messages will be cached again
    this.releaseCachedMessages()

    this.resolveConnectionPromise()
  }

  private readonly handleCloseEvent = async ({
    code,
    reason,
  }: TransportCloseEvent): Promise<void> => {
    this.unregisterTransportEvents()

    this.deleteUrlConnectionParams()

    this.resetTransport()

    this.resetProtocol()

    const wasDisconnecting = this.state.isDisconnecting

    this.state.setDisconnected()

    const disconnectedEvent = this.disconnectedEventFactory.create(
      this,
      code,
      reason,
    )

    await this.disconnected.emit(disconnectedEvent)

    if (!this.state.isDisconnected) {
      this.rejectDisconnectionPromise(
        new AbortError('Disconnection has been aborted'),
      )

      return
    }

    if (!wasDisconnecting && this.confirmReconnection(code)) {
      try {
        await this.reconnect()
      } catch (error: unknown) {
        if (error instanceof AbortError) {
          if (this.state.isConnecting) {
            return
          }

          if (this.state.isDisconnecting) {
            this.state.setDisconnected()

            await this.disconnected.emit(disconnectedEvent)
          }
        } else {
          throw error
        }
      }
    }

    this.resolveDisconnectionPromise()

    this.rejectConnectionPromise(new AbortError('Connection has been aborted'))
  }

  private readonly handleMessageEvent = async ({
    message,
  }: TransportMessageEvent): Promise<void> => {
    const rawMessage = message instanceof Blob ? await message.text() : message

    const finalMessage = this.protocol.deserialize(rawMessage)

    const messageEvent = this.messageEventFactory.create(this, finalMessage)

    return this.message.emit(messageEvent)
  }
}
