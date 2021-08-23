/* eslint-disable require-await */

import {
  WebSocketClient,
  OutgoingNotifiableInvocationMessage
} from './communication'

import { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class NotifiableInvocation {
  private webSocket: WebSocketClient

  private message: OutgoingNotifiableInvocationMessage

  public constructor(
    webSocket: WebSocketClient,
    shape: NotifiableInvocationShape
  ) {
    this.webSocket = webSocket

    this.message = new OutgoingNotifiableInvocationMessage(
      shape.handlerName,
      shape.args
    )
  }

  public perform(): void {
    this.webSocket.send(this.message)
  }
}
