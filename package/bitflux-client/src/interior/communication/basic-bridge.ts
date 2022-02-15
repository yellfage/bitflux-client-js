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

import type { BridgeEventHandlerMap } from './bridge-event-handler-map'

import { EmptyAgreement } from './empty-agreement'

import type { Negotiator } from './negotiator'

const TRANSPORT_PARAM_NAME = 'transport'
const PROTOCOL_PARAM_NAME = 'protocol'

const DEFAULT_AGREEMENT = new EmptyAgreement()

export class BasicBridge implements Bridge {
  public url: URL

  public readonly state: MutableState

  private readonly negotiator: Negotiator

  private readonly eventEmitter: EventEmitter<BridgeEventHandlerMap>

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
    logger: Logger,
    reconnectionControl: ReconnectionControl,
    reconnectionDelayScheme: ReconnectionDelayScheme,
  ) {
    this.url = url
    this.state = state
    this.negotiator = negotiator
    this.eventEmitter = eventEmitter
    this.logger = logger
    this.reconnectionControl = reconnectionControl
    this.reconnectionDelayScheme = reconnectionDelayScheme
  }

  /**
   * @throws {@link AbortError}
   */
  public async connect(url = this.url.toString()): Promise<void> {
    if (url !== this.url.toString()) {
      this.url = new URL(url)
    }

    this.state.setConnecting()

    await this.eventEmitter.emit('connecting', { target: this })

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

      this.logger.logError(error)

      if (
        !this.reconnectionControl.confirmError({
          attempts: this.reconnectionAttempts,
          error,
        })
      ) {
        this.state.setDisconnected()

        throw new AbortError(`The connection has been aborted: unknown error`)
      }

      await this.reconnect()

      // We do no need to continue because a connection is already established
      return
    }

    this.state.setConnected()

    // We need to send cached messages only after the "connected" state is setted
    // Otherwise, the cached messages will be cached again
    this.sendCachedMessages()

    await this.eventEmitter.emit('connected', { target: this })
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

    await this.eventEmitter.emit('terminating', { target: this, reason })

    if (wasReconnecting) {
      this.abortReconnection()

      this.resetReconnection()
    }

    if (wasConnected) {
      await this.disconnect(reason)
    }

    this.state.setTerminated()

    await this.eventEmitter.emit('terminated', { target: this, reason })
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

    await this.eventEmitter.emit('reconnecting', {
      target: this,
      attempts: this.reconnectionAttempts,
      delay: attemptDelay,
    })

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

    await this.eventEmitter.emit('reconnected', {
      target: this,
      attempts: this.reconnectionAttempts,
    })

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

    await this.eventEmitter.emit('disconnected', { target: this, code, reason })

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
    const finalMessage =
      message instanceof Blob ? await message.text() : message

    await this.eventEmitter.emit('message', {
      target: this,
      message: this.agreement.protocol.deserialize(finalMessage),
    })
  }
}
