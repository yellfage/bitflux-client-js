import { Logger } from '../logging'
import { InvocationHandler } from '../invocation-handler'
import { IncomingMessage, IncomingMessageType } from '../communication'

import {
  WebSocketClient,
  WebSocketMessageEvent,
  IncomingNotifiableInvocationMessage
} from './communication'

export class HandlerMapper {
  private webSocket: WebSocketClient
  private logger: Logger

  public constructor(webSocket: WebSocketClient, logger: Logger) {
    this.webSocket = webSocket
    this.logger = logger
  }

  public map(handlerName: string, handler: InvocationHandler): void {
    this.webSocket.on(
      'message',
      async ({ data: message }: WebSocketMessageEvent<IncomingMessage>) => {
        if (!this.isNotifiableInvocationMessage(message)) {
          return
        }

        if (message.handlerName !== handlerName) {
          this.logger.logWarning(
            'Unable process incoming notifiable invocation: ' +
              `the '${message.handlerName}' handler not found`
          )

          return
        }

        await handler(...message.arguments)
      }
    )
  }

  private isNotifiableInvocationMessage(
    message: IncomingMessage
  ): message is IncomingNotifiableInvocationMessage {
    return message.type === IncomingMessageType.NotifiableInvocation
  }
}
