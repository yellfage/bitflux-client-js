/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import delay from 'delay'

import { WebSocketClient } from './web-socket-client'
import { MutableState } from './mutable-state'
import { EventEmitter } from '../event-emitter'
import { PromisfiedWebSocket } from './promisfied-web-socket'

import { Protocol } from '../../communication'
import { ReconnectionPolicy } from '../../configuration'

import { Logger } from '../../logging'
import { Callback } from '../callback'

import { WebSocketEvents } from './web-socket-events'

import { NumberUtils } from '../number-utils'

export class DefaultWebSocketClient implements WebSocketClient {
  public get url(): string {
    return this.webSocket.url
  }

  public readonly state: MutableState

  private logger: Logger

  private eventEmitter: EventEmitter<WebSocketEvents>

  private readonly protocols: Protocol[]

  private readonly reconnectionPolicy: ReconnectionPolicy

  private reconnectionAttempts: number
  private reconnectionAbortController: AbortController

  private cachedMessages: Set<any>

  private readonly webSocket: PromisfiedWebSocket

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

    this.reconnectionAttempts = 0
    this.reconnectionAbortController = new AbortController()

    this.cachedMessages = new Set<any>()

    this.webSocket = webSocket

    this.webSocket.onopen = this.handleOpenEvent
    this.webSocket.onclose = this.handleCloseEvent
    this.webSocket.onmessage = this.handleMessageEvent
  }

  public async start(url?: string): Promise<void> {
    if (!this.state.isTerminated) {
      return
    }

    await this.connect(url)

    if (!this.state.isConnected) {
      throw new Error(
        'Failed to establish a connection or the client was terminated after connection'
      )
    }
  }

  public async stop(reason = 'Stopping'): Promise<void> {
    if (this.state.isTerminating || this.state.isTerminated) {
      return
    }

    await this.terminate(reason)
  }

  public send(message: any): void {
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

  private sendCore(message: any): void {
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
    } catch (error) {
      if (this.state.isTerminating) {
        return
      }

      this.logger.logError(error)

      if (!this.reconnectionPolicy.confirm()) {
        return this.terminate('Reconnection terminated')
      }

      await this.reconnect()
    }
  }

  private async reconnect(): Promise<void> {
    ++this.reconnectionAttempts

    const attemptDelay = this.reconnectionPolicy.getNextDelay(
      this.reconnectionAttempts
    )

    if (!NumberUtils.isNumber(attemptDelay) || Number.isNaN(attemptDelay)) {
      throw new Error(`Invalid reconnection delay. Value: ${attemptDelay}`)
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
      return this.connect()
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

    return this.connect()
  }

  private async terminate(reason: string): Promise<void> {
    this.state.setTerminating()

    await this.eventEmitter.emit('terminating', { reason })

    // We need to perform all cleanup operations only after
    // emitting "terminating" event to clear everything for sure
    this.clearCachedMessages()
    this.cancelReconnection()

    await this.webSocket.stop()

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
    this.cachedMessages = new Set<any>()
  }

  private resolveProtocol(): Protocol {
    return this.protocols.find(
      (protocol) => protocol.name === this.webSocket.subProtocol
    )!
  }

  private handleOpenEvent = async () => {
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

  private handleCloseEvent = async (code: number, reason: string) => {
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
      return this.terminate(`Disconnected. Code: ${code}. Reason: ${reason}`)
    }

    await this.reconnect()
  }

  private handleMessageEvent = async (data: any) => {
    await this.eventEmitter.emit('message', {
      data: this.resolveProtocol().deserialize(data)
    })
  }
}
