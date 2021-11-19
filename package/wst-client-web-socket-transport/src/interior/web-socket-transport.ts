import type { EventEmitter } from '@yellfage/event-emitter'

import { DisconnectionCode } from '@yellfage/wst-client'

import type { TransportEventHandlerMap, Transport } from '@yellfage/wst-client'

import type { WebSocketUrlScheme } from '../web-socket-url-scheme'

import type { PromisfiedWebSocket } from './promisfied-web-socket'

import { WebSocketDisconnectionCode } from './web-socket-disconnection-code'

export class WebSocketTransport implements Transport {
  public readonly name = 'web-socket'

  private readonly eventEmitter: EventEmitter<TransportEventHandlerMap>

  private readonly webSocket: PromisfiedWebSocket

  private readonly urlScheme: WebSocketUrlScheme

  public constructor(
    eventEmitter: EventEmitter<TransportEventHandlerMap>,
    webSocket: PromisfiedWebSocket,
    urlScheme: WebSocketUrlScheme
  ) {
    this.eventEmitter = eventEmitter
    this.webSocket = webSocket
    this.urlScheme = urlScheme

    this.webSocket.onclose = this.handleWebSocketCloseEvent
    this.webSocket.onmessage = this.handleWebSocketMessageEvent
  }

  public survey(): boolean {
    return typeof WebSocket === 'function'
  }

  public async connect(url: URL): Promise<void> {
    const { host, pathname, search } = url

    await this.webSocket.connect(
      `${this.urlScheme}://${host}${pathname}${search}`
    )
  }

  public async disconnect(reason?: string): Promise<void> {
    await this.webSocket.disconnect(reason)
  }

  public async terminate(reason?: string): Promise<void> {
    await this.disconnect(reason)
  }

  public send(message: string): void {
    this.webSocket.send(message)
  }

  public on<TEventName extends keyof TransportEventHandlerMap>(
    eventName: TEventName,
    handler: TransportEventHandlerMap[TEventName]
  ): TransportEventHandlerMap[TEventName] {
    return this.eventEmitter.on(eventName, handler)
  }

  public off<TEventName extends keyof TransportEventHandlerMap>(
    eventName: TEventName,
    handler: TransportEventHandlerMap[TEventName]
  ): void {
    this.eventEmitter.off(eventName, handler)
  }

  private readonly handleWebSocketCloseEvent = async ({
    code,
    reason
  }: CloseEvent): Promise<void> => {
    let finalCode = DisconnectionCode.Abnormal

    if (code === WebSocketDisconnectionCode.Normal) {
      finalCode = DisconnectionCode.Normal
    }

    await this.eventEmitter.emit('disconnected', {
      target: this,
      code: finalCode,
      reason
    })
  }

  private readonly handleWebSocketMessageEvent = async ({
    data
  }: MessageEvent<string | Blob>): Promise<void> => {
    await this.eventEmitter.emit('message', {
      target: this,
      message: data
    })
  }
}
