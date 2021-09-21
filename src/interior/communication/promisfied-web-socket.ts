import WebSocket from 'isomorphic-ws'

import { DeferredPromise } from '../deferred-promise'

export class PromisfiedWebSocket {
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

  public onopen: (() => unknown) | null

  public onclose: ((code: number, reason: string) => unknown) | null

  public onmessage: ((data: unknown) => unknown) | null

  private webSocket: WebSocket | null

  private readonly subProtocols: string[]

  private deferredOpeningPromise: DeferredPromise<void> | null

  private deferredClosingPromise: DeferredPromise<void> | null

  public constructor(subProtocols: string[]) {
    this.subProtocols = subProtocols

    this.onopen = null
    this.onclose = null
    this.onmessage = null

    this.webSocket = null

    this.deferredOpeningPromise = null
    this.deferredClosingPromise = null
  }

  public async connect(url: string): Promise<void> {
    if (this.webSocket) {
      throw new Error('The WebSocket is already connected')
    }

    this.webSocket = new WebSocket(url, this.subProtocols)

    this.webSocket.addEventListener('open', async () => this.handleOpenEvent())

    this.webSocket.addEventListener('close', async ({ code, reason }) =>
      this.handleCloseEvent(code, reason)
    )

    this.webSocket.addEventListener('message', async ({ data }) =>
      this.handleMessageEvent(data)
    )

    this.deferredOpeningPromise = new DeferredPromise()

    return this.deferredOpeningPromise.promise
  }

  public async disconnect(code?: number, reason?: string): Promise<void> {
    if (!this.webSocket) {
      throw new Error('The WebSocket is not connected')
    }

    this.webSocket.close(code, reason)

    this.deferredClosingPromise = new DeferredPromise()

    return this.deferredClosingPromise.promise
  }

  public send(
    message: ArrayBufferLike | ArrayBufferView | Blob | string
  ): void {
    if (!this.webSocket || this.webSocket.readyState !== this.webSocket.OPEN) {
      throw new Error('The WebSocket is not connected')
    }

    this.webSocket.send(message)
  }

  private readonly handleOpenEvent = async (): Promise<void> => {
    if (this.onopen) {
      await this.onopen()
    }

    this.deferredOpeningPromise?.resolve()

    this.deferredOpeningPromise = null
  }

  private readonly handleCloseEvent = async (
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

  private readonly handleMessageEvent = async (
    data: unknown
  ): Promise<void> => {
    if (this.onmessage) {
      await this.onmessage(data)
    }
  }
}
