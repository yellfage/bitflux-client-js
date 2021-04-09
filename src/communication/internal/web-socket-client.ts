import { IWebSocketClient } from './i-web-socket-client'
import { WebSocketCloseEventHandler } from './web-socket-close-event-handler'
import { WebSocketOpenEventHandler } from './web-socket-open-event-handler'
import { WebSocketMessageEventHandler } from './web-socket-message-event-handler'

import { WebSocketState } from './web-socket-state'
import { WebSocketCloseStatus } from '../../web-socket-close-status'

import { DeferredPromise } from '../../internal/deferred-promise'
import { InvalidOperationError } from '../../invalid-operation-error'

export class WebSocketClient implements IWebSocketClient {
  public uri: string

  public get state(): WebSocketState {
    return this.webSocket?.readyState || WebSocketState.Created
  }

  public get subProtocol(): string {
    return this.webSocket?.protocol || ''
  }

  public onopen: WebSocketOpenEventHandler | null
  public onclose: WebSocketCloseEventHandler | null
  public onmessage: WebSocketMessageEventHandler | null

  private webSocket: WebSocket | null

  private subProtocols: string[]

  private deferredOpeningPromise: DeferredPromise<void> | null
  private deferredClosingPromise: DeferredPromise<void> | null

  public constructor(uri: string, subProtocols: string[]) {
    this.uri = uri
    this.subProtocols = subProtocols

    this.onopen = null
    this.onclose = null
    this.onmessage = null

    this.webSocket = null

    this.deferredOpeningPromise = null
    this.deferredClosingPromise = null
  }

  public start(uri = this.uri): Promise<void> {
    if (this.state !== WebSocketState.Created) {
      throw new InvalidOperationError('The WebSocket has already been started')
    }

    this.webSocket = new WebSocket(uri, this.subProtocols)

    this.webSocket.onopen = this.handleOpenEvent
    this.webSocket.onclose = this.handleCloseEvent
    this.webSocket.onmessage = this.handleMessageEvent

    this.deferredOpeningPromise = new DeferredPromise()

    return this.deferredOpeningPromise.promise
  }

  public stop(
    status?: WebSocketCloseStatus,
    statusDescription?: string
  ): Promise<void> {
    if (this.state >= WebSocketState.Closed) {
      throw new InvalidOperationError('The WebSocket is not connected')
    }

    this.webSocket!.close(status, statusDescription)

    this.webSocket = null

    this.deferredClosingPromise = new DeferredPromise()

    return this.deferredClosingPromise.promise
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.state !== WebSocketState.Open) {
      throw new InvalidOperationError('The WebSocket is not connected')
    }

    this.webSocket!.send(data)
  }

  private handleOpenEvent = async (): Promise<void> => {
    this.uri = this.webSocket!.url

    if (this.onopen) {
      await Promise.resolve(this.onopen({}))
    }

    this.deferredOpeningPromise?.resolve()

    this.deferredOpeningPromise = null
  }

  private handleCloseEvent = async (event: CloseEvent): Promise<void> => {
    if (this.deferredOpeningPromise) {
      this.deferredOpeningPromise.reject(
        `Status: ${event.code}. Status description: ${event.reason}`
      )

      this.deferredOpeningPromise = null

      return
    }

    if (this.onclose) {
      await Promise.resolve(
        this.onclose({ status: event.code, statusDescription: event.reason })
      )
    }

    this.deferredClosingPromise?.resolve()

    this.deferredClosingPromise = null
  }

  private handleMessageEvent = async (event: MessageEvent): Promise<void> => {
    if (this.onmessage) {
      await Promise.resolve(this.onmessage({ data: event.data }))
    }
  }
}
