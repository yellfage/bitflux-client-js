import { WebSocketClient } from './communication'

export abstract class InvocationFactory {
  protected webSocket: WebSocketClient

  public constructor(webSocket: WebSocketClient) {
    this.webSocket = webSocket
  }
}
