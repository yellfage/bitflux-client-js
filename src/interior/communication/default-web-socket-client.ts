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
  public get url(): string {
    return this.webSocket.url
  }

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
    state: MutableState,
    logger: Logger,
    eventEmitter: EventEmitter<WebSocketEvents>,
    protocols: Protocol[],
    reconnectionPolicy: ReconnectionPolicy,
    webSocket: PromisfiedWebSocket
  ) {
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

  public async start(url?: string): Promise<void> {
    if (!this.state.isTerminated) {
      throw new Error(
        "Unable to start the client: the client is not in the 'Terminated' state"
      )
    }

    await this.connect(url)

    if (!this.state.isConnected) {
      throw new Error(
        'Failed to establish a connection or the client was terminated during connection'
      )
    }
  }

  public async restart(url?: string): Promise<void> {
    this.cancelReconnection()

    await this.disconnect()

    await this.connect(url)

    if (!this.state.isConnected) {
      throw new Error(
        'Failed to establish a connection or the client was terminated during connection'
      )
    }
  }

  public async stop(reason = 'Stopping'): Promise<void> {
    if (this.state.isTerminating || this.state.isTerminated) {
      throw new Error(
        "Unable to stop the client: the client is already in the 'Terminating' or the 'Terminated' state"
      )
    }

    await this.terminate(reason)
  }

  public send(message: unknown): void {
    if (!this.state.isConnected) {
      this.cachedMessages.add(message)

      return
    }

    this.sendCore(message)
  }

  public on(eventName: keyof WebSocketEvents, handler: Callback): Callback {
    return this.eventEmitter.on(eventName, handler)
  }

  public off(eventName: keyof WebSocketEvents, handler: Callback): void {
    this.eventEmitter.off(eventName, handler)
  }

  private sendCore(message: unknown): void {
    const serializedMessage = this.resolveProtocol().serialize(message)

    this.webSocket.send(serializedMessage)
  }

  private async connect(url = this.url): Promise<void> {
    this.state.setConnecting()

    await this.eventEmitter.emit('connecting', { url })

    // Check if a "connecting" event handler has called stop()
    if (!this.state.isConnecting) {
      return
    }

    try {
      await this.webSocket.start(url)
    } catch (error: unknown) {
      if (this.state.isTerminating) {
        return
      }

      this.logger.logError(error)

      if (!this.reconnectionPolicy.confirm()) {
        await this.terminate('Reconnection terminated')

        return
      }

      await this.reconnect()
    }
  }

  private async disconnect(): Promise<void> {
    return this.webSocket.stop()
  }

  private async reconnect(): Promise<void> {
    this.reconnectionAttempts += 1

    const attemptDelay = this.reconnectionPolicy.getNextDelay(
      this.reconnectionAttempts
    )

    if (!isNumber(attemptDelay) || Number.isNaN(attemptDelay)) {
      throw new Error(
        `Unable to reconnect: invalid reconnection delay "${attemptDelay}"`
      )
    }

    this.state.setReconnecting()

    await this.eventEmitter.emit('reconnecting', {
      attempts: this.reconnectionAttempts,
      delay: attemptDelay
    })

    // Check if a "reconnecting" event handler has called stop()
    if (!this.state.isReconnecting) {
      return
    }

    if (attemptDelay <= 0) {
      await this.connect()

      return
    }

    if (this.reconnectionAbortController.signal.aborted) {
      this.reconnectionAbortController = new AbortController()
    }

    try {
      await delay(attemptDelay, {
        signal: this.reconnectionAbortController.signal
      })
    } catch {
      return
    }

    await this.connect()
  }

  private async terminate(reason: string): Promise<void> {
    this.state.setTerminating()

    await this.eventEmitter.emit('terminating', { reason })

    // We need to perform all cleanup operations only after
    // emitting "terminating" event to clear everything for sure
    this.clearCachedMessages()
    this.cancelReconnection()

    await this.disconnect()

    this.state.setTerminated()

    await this.eventEmitter.emit('terminated', { reason })
  }

  private cancelReconnection(): void {
    this.reconnectionAbortController.abort()

    this.reconnectionPolicy.reset()

    this.reconnectionAttempts = 0
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

      this.reconnectionPolicy.reset()

      this.reconnectionAttempts = 0
    }
  }

  private readonly handleCloseEvent = async (
    code: number,
    reason: string
  ): Promise<void> => {
    if (this.state.isTerminating) {
      return
    }

    this.state.setDisconnected()

    await this.eventEmitter.emit('disconnected', { code, reason })

    // Check if a "disconnected" event handler has called stop()
    if (!this.state.isDisconnected) {
      return
    }

    if (!this.reconnectionPolicy.confirmCode(code)) {
      return
    }

    await this.reconnect()
  }

  private readonly handleMessageEvent = async (
    data: unknown
  ): Promise<void> => {
    await this.eventEmitter.emit('message', {
      data: this.resolveProtocol().deserialize(data)
    })
  }
}
