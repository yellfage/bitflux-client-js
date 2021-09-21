import delay from 'delay'

import type { Protocol } from '../../communication'

import type { ReconnectionPolicy } from '../../configuration'

import type { Logger } from '../../logging'

import type { Callback } from '../callback'

import type { EventEmitter } from '../event-emitter'

import { isNumber } from '../number-utils'

import type { MutableState } from './mutable-state'

import type { PromisfiedWebSocket } from './promisfied-web-socket'

import type { WebSocketClient } from './web-socket-client'

import type { WebSocketEvents } from './web-socket-events'

export class DefaultWebSocketClient implements WebSocketClient {
  public url: URL

  public readonly state: MutableState

  private readonly logger: Logger

  private readonly eventEmitter: EventEmitter<WebSocketEvents>

  private readonly protocols: Protocol[]

  private readonly reconnectionPolicy: ReconnectionPolicy

  private readonly webSocket: PromisfiedWebSocket

  private reconnectionAttempts: number

  private reconnectionAbortController: AbortController

  private cachedMessages: Set<unknown>

  public constructor(
    url: string,
    state: MutableState,
    logger: Logger,
    eventEmitter: EventEmitter<WebSocketEvents>,
    protocols: Protocol[],
    reconnectionPolicy: ReconnectionPolicy,
    webSocket: PromisfiedWebSocket
  ) {
    this.url = new URL(url)
    this.state = state
    this.logger = logger
    this.eventEmitter = eventEmitter
    this.protocols = protocols
    this.reconnectionPolicy = reconnectionPolicy
    this.webSocket = webSocket
    this.reconnectionAttempts = 0
    this.reconnectionAbortController = new AbortController()
    this.cachedMessages = new Set<unknown>()

    this.webSocket.onopen = this.handleOpenEvent
    this.webSocket.onclose = this.handleCloseEvent
    this.webSocket.onmessage = this.handleMessageEvent
  }

  public async connect(url?: string): Promise<void> {
    if (!this.state.isDisconnected) {
      throw new Error(
        'Unable to perform connection: the client is not disconnected'
      )
    }

    await this.performConnection(url)
  }

  public async reconnect(url?: string): Promise<void> {
    this.checkTermination()

    if (this.state.isConnected) {
      await this.performDisconnection()
    }

    await this.performConnection(url)
  }

  public async reconnectCoercively(): Promise<void> {
    if (!this.state.isConnecting) {
      throw new Error(
        'Unable to perform coercive reconnection: the client is not connecting'
      )
    }

    await this.performReconnection()
  }

  public hasteReconnection(): void {
    if (!this.state.isReconnecting) {
      return
    }

    this.reconnectionAbortController.abort()
  }

  public resetReconnection(): void {
    this.reconnectionAttempts = 0

    this.reconnectionPolicy.reset()
  }

  public async disconnect(reason = 'Manual disconnection'): Promise<void> {
    if (!this.state.isConnected) {
      throw new Error(
        'Unable to perform disconnection: the client is not connected'
      )
    }

    await this.performDisconnection(reason)
  }

  public async terminate(reason = 'Manual termination'): Promise<void> {
    this.checkTermination()

    await this.performTermination(reason)
  }

  public send(message: unknown): void {
    this.checkTermination()

    if (!this.state.isConnected) {
      this.cachedMessages.add(message)

      return
    }

    this.sendCore(message)
  }

  public on(eventName: keyof WebSocketEvents, handler: Callback): Callback {
    this.checkTermination()

    return this.eventEmitter.on(eventName, handler)
  }

  public off(eventName: keyof WebSocketEvents, handler: Callback): void {
    this.checkTermination()

    this.eventEmitter.off(eventName, handler)
  }

  private sendCore(message: unknown): void {
    const serializedMessage = this.resolveProtocol().serialize(message)

    this.webSocket.send(serializedMessage)
  }

  private async performConnection(url = this.url.toString()): Promise<void> {
    if (url !== this.url.toString()) {
      this.url = new URL(url)
    }

    this.state.setConnecting()

    await this.eventEmitter.emit('connecting', { url: this.url })

    if (this.state.isConnected) {
      return
    }

    // Check if a "connecting" event handler has called terminate()
    if (!this.state.isConnecting) {
      throw new Error('Failed to establish a connection: termination')
    }

    try {
      await this.webSocket.connect(url)
    } catch (error: unknown) {
      if (this.state.isTerminating) {
        throw new Error(
          'Failed to establish a connection: termination during connection'
        )
      }

      this.logger.logError(error)

      if (!this.reconnectionPolicy.confirm()) {
        this.state.setDisconnected()

        throw new Error(`Failed to establish a connection: unknown error`)
      }

      await this.performReconnection()
    }
  }

  private async performDisconnection(reason?: string): Promise<void> {
    await this.webSocket.disconnect(1000, reason)
  }

  private async performReconnection(): Promise<void> {
    this.reconnectionAttempts += 1

    const attemptDelay = this.reconnectionPolicy.getNextDelay(
      this.reconnectionAttempts
    )

    if (!isNumber(attemptDelay) || Number.isNaN(attemptDelay)) {
      throw new Error(
        `Unable to perform reconnection: the reconnection delay "${attemptDelay}" is invalid`
      )
    }

    this.state.setReconnecting()

    await this.eventEmitter.emit('reconnecting', {
      attempts: this.reconnectionAttempts,
      delay: attemptDelay
    })

    // Check if a "reconnecting" event handler has called terminate()
    if (!this.state.isReconnecting) {
      throw new Error('Unable to perform reconnection: termination')
    }

    if (attemptDelay <= 0) {
      return this.performConnection()
    }

    if (this.reconnectionAbortController.signal.aborted) {
      this.reconnectionAbortController = new AbortController()
    }

    try {
      await delay(attemptDelay, {
        signal: this.reconnectionAbortController.signal
      })
    } catch {
      if (this.state.isTerminating) {
        throw new Error('Unable to perform reconnection: termination')
      }
    }

    await this.performConnection()
  }

  private async performTermination(reason: string): Promise<void> {
    this.state.setTerminating()

    await this.eventEmitter.emit('terminating', { reason })

    if (this.state.isReconnecting) {
      this.cancelReconnection()
    }

    if (this.state.isConnected) {
      await this.performDisconnection('Termination')
    }

    this.state.setTerminated()

    await this.eventEmitter.emit('terminated', { reason })

    // We need to perform all cleanup operations only after
    // emitting the event "terminated" to clear everything for sure
    this.clearCachedMessages()
  }

  private cancelReconnection(): void {
    if (!this.state.isReconnecting) {
      throw new Error(
        'Unable to cancel reconnection: a reconnection is not performing'
      )
    }

    this.reconnectionPolicy.reset()

    this.reconnectionAbortController.abort()
  }

  private checkTermination(): void {
    if (this.state.isTerminating || this.state.isTerminated) {
      throw new Error(
        'Unable to perform the operation: the client is terminating or has already terminated'
      )
    }
  }

  private processCachedMessages(): void {
    this.cachedMessages.forEach((message) => this.send(message))

    this.clearCachedMessages()
  }

  private clearCachedMessages(): void {
    this.cachedMessages = new Set<unknown>()
  }

  private resolveProtocol(): Protocol {
    const protocol = this.protocols.find(
      ({ name }) => name === this.webSocket.subProtocol
    )

    if (!protocol) {
      throw new Error('Unable to resolve negotiated sub protocol')
    }

    return protocol
  }

  private readonly handleOpenEvent = async (): Promise<void> => {
    this.state.setConnected()

    // We need to process the cached messages only after the "connected" state is set
    // Otherwise, the cached messages will be cached again
    this.processCachedMessages()

    await this.eventEmitter.emit('connected', { url: this.url })

    if (this.reconnectionAttempts > 0) {
      await this.eventEmitter.emit('reconnected', {
        attempts: this.reconnectionAttempts
      })

      this.resetReconnection()
    }
  }

  private readonly handleCloseEvent = async (
    code: number,
    reason: string
  ): Promise<void> => {
    this.state.setDisconnected()

    await this.eventEmitter.emit('disconnected', { code, reason })

    // Check if a "disconnected" event handler has called terminate()
    if (!this.state.isDisconnected) {
      return
    }

    if (!this.reconnectionPolicy.confirmCode(code)) {
      return
    }

    await this.performReconnection()
  }

  private readonly handleMessageEvent = async (
    data: unknown
  ): Promise<void> => {
    await this.eventEmitter.emit('message', {
      data: this.resolveProtocol().deserialize(data)
    })
  }
}
