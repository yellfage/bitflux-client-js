import { DisconnectionCode } from '@yellfage/bitflux-client'

import type {
  Transport,
  TransportMessageEventHandler,
  TransportCloseEventHandler,
  TransportOpenEventHandler,
} from '@yellfage/bitflux-client'

import type { WebSocketUrlScheme } from '../web-socket-url-scheme'

import { WebSocketDisconnectionCode } from './web-socket-disconnection-code'

export class WebSocketTransport implements Transport {
  public readonly name = 'web-socket'

  public onopen: TransportOpenEventHandler | null

  public onclose: TransportCloseEventHandler | null

  public onmessage: TransportMessageEventHandler | null = null

  private readonly urlScheme: WebSocketUrlScheme

  private webSocket: WebSocket | null = null

  public constructor(urlScheme: WebSocketUrlScheme) {
    this.urlScheme = urlScheme
  }

  public survey(): boolean {
    return typeof WebSocket === 'function'
  }

  public open(url: URL, protocols: string[]): void {
    const { host, pathname, search } = url

    this.webSocket = new WebSocket(
      `${this.urlScheme}://${host}${pathname}${search}`,
      protocols,
    )

    this.webSocket.binaryType = 'blob'

    this.webSocket.onopen = this.handleOpenEvent
    this.webSocket.onclose = this.handleCloseEvent
    this.webSocket.onmessage = this.handleMessageEvent
  }

  public close(reason?: string): void {
    this.webSocket?.close(WebSocketDisconnectionCode.Normal, reason)
  }

  public send(message: string): void {
    this.webSocket?.send(message)
  }

  private readonly handleOpenEvent = async (): Promise<void> => {
    if (!this.onopen) {
      return
    }

    return this.onopen({
      target: this,
      protocol: this.webSocket?.protocol ?? null,
    })
  }

  private readonly handleCloseEvent = async ({
    code,
    reason,
  }: CloseEvent): Promise<void> => {
    if (!this.onclose) {
      return
    }

    const finalCode =
      code === WebSocketDisconnectionCode.Normal
        ? DisconnectionCode.Normal
        : DisconnectionCode.Abnormal

    return this.onclose({ target: this, code: finalCode, reason })
  }

  private readonly handleMessageEvent = async ({
    data,
  }: MessageEvent<string | Blob>): Promise<void> => {
    if (!this.onmessage) {
      return
    }

    return this.onmessage({ target: this, message: data })
  }
}
