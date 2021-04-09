import { IWebSocketClient } from '../communication/internal/i-web-socket-client'

export interface IWebSocketClientFactory {
  create(uri: string, subProtocols: string[]): IWebSocketClient
}
