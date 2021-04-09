import { IWebSocketClientFactory } from './i-web-socket-client-factory'
import { IWebSocketClient } from '../communication/internal/i-web-socket-client'
import { WebSocketClient } from '../communication/internal/web-socket-client'

export class WebSocketClientFactory implements IWebSocketClientFactory {
  create(uri: string, subProtocols: string[]): IWebSocketClient {
    return new WebSocketClient(uri, subProtocols)
  }
}
