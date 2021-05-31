import { IWebSocketClient } from '../communication/internal/i-web-socket-client'

export interface IWebSocketClientFactory {
  create(url: string, subProtocols: string[]): IWebSocketClient
}
