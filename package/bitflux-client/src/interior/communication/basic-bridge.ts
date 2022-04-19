import type { EventEmitter } from '@yellfage/event-emitter'

import delay from 'delay'

import { AbortError } from '../../abort-error'

import { DisconnectionCode } from '../../communication'

import type {
  OutgoingMessage,
  TransportDisconnectedEvent,
  TransportMessageEvent,
} from '../../communication'

import type { Logger } from '../../logging'

import type {
  ReconnectionControl,
  ReconnectionDelayScheme,
} from '../../reconnection'

import type { MutableState } from '../mutable-state'

import type { Agreement } from './agreement'

import type { Bridge } from './bridge'

import { EmptyAgreement } from './empty-agreement'

import type {
  BridgeEventHandlerMap,
  ConnectedBridgeEventFactory,
  ConnectingBridgeEventFactory,
  DisconnectedBridgeEventFactory,
  MessageBridgeEventFactory,
  ReconnectedBridgeEventFactory,
  ReconnectingBridgeEventFactory,
  TerminatedBridgeEventFactory,
  TerminatingBridgeEventFactory,
} from './event'

import type { Negotiator } from './negotiator'

const TRANSPORT_PARAM_NAME = 'transport'
const PROTOCOL_PARAM_NAME = 'protocol'

const DEFAULT_AGREEMENT = new EmptyAgreement()

export class BasicBridge implements Bridge {
  public url: URL

  public readonly state: MutableState

  private readonly negotiator: Negotiator

  private readonly eventEmitter: EventEmitter<BridgeEventHandlerMap>

  private readonly connectingEventFactory: ConnectingBridgeEventFactory

  private readonly connectedEventFactory: ConnectedBridgeEventFactory

  private readonly disconnectedEventFactory: DisconnectedBridgeEventFactory

  private readonly reconnectingEventFactory: ReconnectingBridgeEventFactory

  private readonly reconnectedEventFactory: ReconnectedBridgeEventFactory

  private readonly terminatingEventFactory: TerminatingBridgeEventFactory

  private readonly terminatedEventFactory: TerminatedBridgeEventFactory

  private readonly messageEventFactory: MessageBridgeEventFactory

  private readonly logger: Logger

  private readonly reconnectionControl: ReconnectionControl

  private readonly reconnectionDelayScheme: ReconnectionDelayScheme

  private readonly cachedMessages = new Set<OutgoingMessage>()

  private agreement: Agreement = DEFAULT_AGREEMENT

  private reconnectionAttempts = 0

  private reconnectionAbortController = new AbortController()

  public constructor(
    url: URL,
    state: MutableState,
    negotiator: Negotiator,
    eventEmitter: EventEmitter<BridgeEventHandlerMap>,
    connectingEventFactory: ConnectingBridgeEventFactory,
    connectedEventFactory: ConnectedBridgeEventFactory,
    disconnectedEventFactory: DisconnectedBridgeEventFactory,
    reconnectingEventFactory: ReconnectingBridgeEventFactory,
    reconnectedEventFactory: ReconnectedBridgeEventFactory,
    terminatingEventFactory: TerminatingBridgeEventFactory,
    terminatedEventFactory: TerminatedBridgeEventFactory,
    messageEventFactory: MessageBridgeEventFactory,
    logger: Logger,
    reconnectionControl: ReconnectionControl,
    reconnectionDelayScheme: ReconnectionDelayScheme,
  ) {
    this.url = url
    this.state = state
    this.negotiator = negotiator
    this.eventEmitter = eventEmitter
    this.connectingEventFactory = connectingEventFactory
    this.connectedEventFactory = connectedEventFactory
    this.disconnectedEventFactory = disconnectedEventFactory
    this.reconnectingEventFactory = reconnectingEventFactory
    this.reconnectedEventFactory = reconnectedEventFactory
    this.terminatingEventFactory = terminatingEventFactory
    this.terminatedEventFactory = terminatedEventFactory
    this.messageEventFactory = messageEventFactory
    this.logger = logger
    this.reconnectionControl = reconnectionControl
    this.reconnectionDelayScheme = reconnectionDelayScheme
  }

  /**
   * @throws {@link AbortError}
   */
  public async connect(url: string | URL = this.url): Promise<void> {
    if (url.toString() !== this.url.toString()) {
      this.url = new URL(url)
    }

    this.state.setConnecting()

    const connectingEvent = this.connectingEventFactory.create(this)

    await this.eventEmitter.emit('connecting', connectingEvent)

    try {
      this.agreement = await this.negotiator.negotiate()

      // We can register the same event handlers multiple times
      // because the event emitter ignores the same event handlers
      this.registerTransportEvents()

      this.setUrlConnectionParams()

      await this.agreement.transport.connect(this.url)
    } catch (error: unknown) {
      if (this.state.isTerminating) {
        throw new AbortError('The connection has been aborted: termination')
      }

      if (
        !this.reconnectionControl.confirmError({
          attempts: this.reconnectionAttempts,
          error,
        })
      ) {
        throw error
      }

      this.logger.logError(error)

      await this.reconnect()

      // We do no need to continue because a connection is already established
      return
    }

    this.state.setConnected()

    // We need to send cached messages only after the "connected" state is setted
    // Otherwise, the cached messages will be cached again
    this.sendCachedMessages()

    const connectedEvent = this.connectedEventFactory.create(this)

    await this.eventEmitter.emit('connected', connectedEvent)
  }

  public async disconnect(reason?: string): Promise<void> {
    if (!this.state.isConnected) {
      throw new Error('Unable to disconnect: already disconnected')
    }

    await this.agreement.transport.disconnect(reason)
  }

  public async terminate(reason = 'Termination'): Promise<void> {
    const wasReconnecting = this.state.isReconnecting
    const wasConnected = this.state.isConnected

    this.state.setTerminating()

    const terminatingEvent = this.terminatingEventFactory.create(this, reason)

    await this.eventEmitter.emit('terminating', terminatingEvent)

    if (wasReconnecting) {
      this.abortReconnection()

      this.resetReconnection()
    }

    if (wasConnected) {
      await this.disconnect(reason)
    }

    this.state.setTerminated()

    const terminatedEvent = this.terminatedEventFactory.create(this, reason)

    await this.eventEmitter.emit('terminated', terminatedEvent)
  }

  public send(message: OutgoingMessage): void {
    if (!this.state.isConnected) {
      this.cachedMessages.add(message)

      return
    }

    this.agreement.transport.send(this.agreement.protocol.serialize(message))
  }

  public on<TEventName extends keyof BridgeEventHandlerMap>(
    eventName: TEventName,
    handler: BridgeEventHandlerMap[TEventName],
  ): BridgeEventHandlerMap[TEventName] {
    return this.eventEmitter.on(eventName, handler)
  }

  public off<TEventName extends keyof BridgeEventHandlerMap>(
    eventName: TEventName,
    handler: BridgeEventHandlerMap[TEventName],
  ): void {
    this.eventEmitter.off(eventName, handler)
  }

  /**
   * @throws {@link AbortError}
   */
  private async reconnect(): Promise<void> {
    this.reconnectionAttempts += 1

    const attemptDelay = this.reconnectionDelayScheme.moveNext()

    this.state.setReconnecting()

    const reconnectingEvent = this.reconnectingEventFactory.create(
      this,
      this.reconnectionAttempts,
      attemptDelay,
    )

    await this.eventEmitter.emit('reconnecting', reconnectingEvent)

    // Check if a "reconnecting" event handler has called terminate()
    if (!this.state.isReconnecting) {
      throw new AbortError('The reconnection has been aborted: termination')
    }

    // We need to recreate the AbortController in case
    // if we are recovering from the "terminated" state
    if (this.reconnectionAbortController.signal.aborted) {
      this.reconnectionAbortController = new AbortController()
    }

    try {
      await delay(attemptDelay, {
        signal: this.reconnectionAbortController.signal,
      })
    } catch (error: unknown) {
      if (this.state.isTerminating) {
        throw new AbortError(
          'The reconnection has been aborted: termination during delay',
        )
      }

      throw error
    }

    await this.connect()

    if (this.reconnectionAttempts <= 0) {
      // We don't need to continue because we have already
      // completed all the necessary operations after reconnecting
      return
    }

    const reconnectedEvent = this.reconnectedEventFactory.create(
      this,
      this.reconnectionAttempts,
    )

    await this.eventEmitter.emit('reconnected', reconnectedEvent)

    this.resetReconnection()
  }

  private sendCachedMessages(): void {
    this.cachedMessages.forEach((message) => this.send(message))

    this.cachedMessages.clear()
  }

  private abortReconnection(): void {
    if (!this.state.isReconnecting) {
      throw new Error(
        'Unable to abort reconnection: a reconnection is not performing',
      )
    }

    this.reconnectionAbortController.abort()
  }

  private resetReconnection(): void {
    this.reconnectionAttempts = 0

    this.reconnectionDelayScheme.reset()
  }

  private resetAgreement(): void {
    this.agreement = DEFAULT_AGREEMENT
  }

  private registerTransportEvents(): void {
    const { transport } = this.agreement

    transport.on('disconnected', this.handleTransportDisconnectedEvent)
    transport.on('message', this.handleTransportMessageEvent)
  }

  private unregisterTransportEvents(): void {
    const { transport } = this.agreement

    transport.off('disconnected', this.handleTransportDisconnectedEvent)
    transport.off('message', this.handleTransportMessageEvent)
  }

  private setUrlConnectionParams(): void {
    const { transport, protocol } = this.agreement

    this.url.searchParams.set(TRANSPORT_PARAM_NAME, transport.name)
    this.url.searchParams.set(PROTOCOL_PARAM_NAME, protocol.name)
  }

  private deleteUrlConnectionParams(): void {
    this.url.searchParams.delete(TRANSPORT_PARAM_NAME)
    this.url.searchParams.delete(PROTOCOL_PARAM_NAME)
  }

  private readonly handleTransportDisconnectedEvent = async ({
    code,
    reason,
  }: TransportDisconnectedEvent): Promise<void> => {
    this.unregisterTransportEvents()

    this.deleteUrlConnectionParams()

    this.resetAgreement()

    this.state.setDisconnected()

    const disconnectedEvent = this.disconnectedEventFactory.create(
      this,
      code,
      reason,
    )

    await this.eventEmitter.emit('disconnected', disconnectedEvent)

    // Check if a "disconnected" event handler has called terminate()
    if (!this.state.isDisconnected) {
      return
    }

    if (
      code === DisconnectionCode.Normal ||
      !this.reconnectionControl.confirm({ attempts: this.reconnectionAttempts })
    ) {
      return
    }

    try {
      await this.reconnect()
    } catch (error: unknown) {
      if (error instanceof AbortError) {
        return
      }

      throw error
    }
  }

  private readonly handleTransportMessageEvent = async ({
    message,
  }: TransportMessageEvent): Promise<void> => {
    const rawMessage = message instanceof Blob ? await message.text() : message

    const finalMessage = this.agreement.protocol.deserialize(rawMessage)

    const messageEvent = this.messageEventFactory.create(this, finalMessage)

    await this.eventEmitter.emit('message', messageEvent)
  }
}
