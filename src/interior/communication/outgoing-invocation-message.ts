import type { OutgoingMessageType } from '../../communication'

import { OutgoingMessage } from '../../communication'

export class OutgoingInvocationMessage extends OutgoingMessage {
  public readonly handlerName: string

  public readonly arguments: unknown[]

  public constructor(
    type: OutgoingMessageType,
    handlerName: string,
    args: unknown[]
  ) {
    super(type)

    this.handlerName = handlerName
    this.arguments = args
  }
}
