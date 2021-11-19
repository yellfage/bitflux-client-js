import type { IncomingMessage } from '../communication'

import { IncomingMessageType } from '../communication'

import type { InvocationHandler } from '../invocation'

import type { Logger } from '../logging'

import type {
  Bridge,
  BridgeMessageEvent,
  IncomingNotifiableInvocationMessage
} from './communication'

import type { HandlerMapper } from './handler-mapper'

export class BasicHandlerMapper implements HandlerMapper {
  private readonly bridge: Bridge

  private readonly logger: Logger

  public constructor(bridge: Bridge, logger: Logger) {
    this.bridge = bridge
    this.logger = logger
  }

  public map(handlerName: string, handler: InvocationHandler): void {
    this.bridge.on('message', async ({ message }: BridgeMessageEvent) => {
      if (!this.isNotifiableInvocationMessage(message)) {
        return
      }

      if (message.handlerName !== handlerName) {
        this.logger.logWarning(
          'Unable process incoming notifiable invocation: ' +
            `the "${message.handlerName}" handler not found`
        )

        return
      }

      await handler(...message.arguments)
    })
  }

  private isNotifiableInvocationMessage(
    message: IncomingMessage
  ): message is IncomingNotifiableInvocationMessage {
    return message.type === IncomingMessageType.NotifiableInvocation
  }
}
