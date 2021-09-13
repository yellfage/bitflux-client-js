import type { WebSocketClient } from './communication'

import { OutgoingNotifiableInvocationMessage } from './communication'

import type { NotifiableInvocationShape } from './notifiable-invocation-shape'

export class NotifiableInvocation {
  private readonly webSocket: WebSocketClient

  private readonly message: OutgoingNotifiableInvocationMessage

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
