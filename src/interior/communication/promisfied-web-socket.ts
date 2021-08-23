/* eslint-disable require-await */
import WebSocket from 'isomorphic-ws'

import { DeferredPromise } from '../deferred-promise'

export class PromisfiedWebSocket {
  public url: string

  public get state(): number {
    if (!this.webSocket) {
      throw new Error('The WebSocket is not connected')
    }

    return this.webSocket.readyState
  }

  public get subProtocol(): string {
    if (!this.webSocket) {
      throw new Error('The WebSocket is not connected')
    }

    return this.webSocket.protocol
  }

  public onopen: (() => any) | null
  public onclose: ((code: number, reason: string) => any) | null
  public onmessage: ((data: any) => any) | null

  private webSocket: WebSocket | null

  private subProtocols: string[]

  private deferredOpeningPromise: DeferredPromise<void> | null
  private deferredClosingPromise: DeferredPromise<void> | null

  public constructor(url: string, subProtocols: string[]) {
    this.url = url
    this.subProtocols = subProtocols

    this.onopen = null
    this.onclose = null
    this.onmessage = null

    this.webSocket = null

    this.deferredOpeningPromise = null
    this.deferredClosingPromise = null
  }

  public async start(url = this.url): Promise<void> {
    if (this.webSocket) {
      return
    }

    this.url = url

    this.webSocket = new WebSocket(url, this.subProtocols)

    this.webSocket.addEventListener('open', () => this.handleOpenEvent())

    this.webSocket.addEventListener('close', ({ code, reason }) =>
      this.handleCloseEvent(code, reason)
    )

    this.webSocket.addEventListener('message', ({ data }) =>
      this.handleMessageEvent(data)
    )

    this.deferredOpeningPromise = new DeferredPromise()

    return this.deferredOpeningPromise.promise
  }

  public async stop(code?: number, reason?: string): Promise<void> {
    if (!this.webSocket) {
      return
    }

    this.webSocket.close(code, reason)

    this.deferredClosingPromise = new DeferredPromise()

    return this.deferredClosingPromise.promise
  }

  public send(
    message: string | ArrayBufferLike | Blob | ArrayBufferView
  ): void {
    if (!this.webSocket || this.webSocket.readyState !== this.webSocket.OPEN) {
      throw new Error('The WebSocket is not connected')
    }

    this.webSocket.send(message)
  }

  private handleOpenEvent = async (): Promise<void> => {
    if (this.onopen) {
      await this.onopen()
    }

    this.deferredOpeningPromise?.resolve()

    this.deferredOpeningPromise = null
  }

  private handleCloseEvent = async (
    code: number,
    reason: string
  ): Promise<void> => {
    this.webSocket = null

    if (this.deferredOpeningPromise) {
      this.deferredOpeningPromise.reject(
        new Error(
          `Unable to establish a connection. Code: ${code}. Reason: ${reason}`
        )
      )

      this.deferredOpeningPromise = null
    } else if (this.onclose) {
      await this.onclose(code, reason)
    }

    this.deferredClosingPromise?.resolve()

    this.deferredClosingPromise = null
  }

  private handleMessageEvent = async (data: any): Promise<void> => {
    if (this.onmessage) {
      return this.onmessage(data)
    }
  }
}
