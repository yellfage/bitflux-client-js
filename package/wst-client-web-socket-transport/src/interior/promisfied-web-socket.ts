import { DeferredPromise } from './deferred-promise'

import { WebSocketDisconnectionCode } from './web-socket-disconnection-code'

export class PromisfiedWebSocket {
  private webSocket: WebSocket | null = null

  private deferredOpeningPromise: DeferredPromise<void> | null = null

  private deferredClosingPromise: DeferredPromise<void> | null = null

  public onopen: (event: Event) => unknown = () => {}

  public onclose: (event: CloseEvent) => unknown = () => {}

  public onmessage: (event: MessageEvent<string | Blob>) => unknown = () => {}

  public async connect(url: string): Promise<void> {
    if (this.webSocket) {
      throw new Error('The WebSocket is already connected')
    }

    this.webSocket = new WebSocket(url)

    this.webSocket.binaryType = 'blob'

    this.webSocket.onopen = this.handleOpenEvent

    this.webSocket.onclose = this.handleCloseEvent

    this.webSocket.onmessage = this.handleMessageEvent

    this.deferredOpeningPromise = new DeferredPromise()

    return this.deferredOpeningPromise.promise
  }

  public async disconnect(reason?: string): Promise<void> {
    if (!this.webSocket) {
      throw new Error('The WebSocket is not connected')
    }

    this.webSocket.close(WebSocketDisconnectionCode.Normal, reason)

    this.deferredClosingPromise = new DeferredPromise()

    return this.deferredClosingPromise.promise
  }

  public send(message: string): void {
    if (!this.webSocket || this.webSocket.readyState !== this.webSocket.OPEN) {
      throw new Error('The WebSocket is not connected')
    }

    this.webSocket.send(message)
  }

  private readonly handleOpenEvent = async (event: Event): Promise<void> => {
    await this.onopen(event)

    this.deferredOpeningPromise?.resolve()

    this.deferredOpeningPromise = null
  }

  private readonly handleCloseEvent = async (
    event: CloseEvent
  ): Promise<void> => {
    this.webSocket = null

    if (this.deferredOpeningPromise) {
      this.deferredOpeningPromise.reject(
        new Error(
          `Unable to establish a connection. Code: ${event.code}. Reason: ${event.reason}`
        )
      )

      this.deferredOpeningPromise = null
    } else {
      await this.onclose(event)
    }

    this.deferredClosingPromise?.resolve()

    this.deferredClosingPromise = null
  }

  private readonly handleMessageEvent = async (
    event: MessageEvent<string | Blob>
  ): Promise<void> => {
    await this.onmessage(event)
  }
}
