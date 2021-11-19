import type { OutgoingMessageType } from '../../communication'

import { OutgoingMessage } from '../../communication'

export class OutgoingInvocationMessage extends OutgoingMessage {
  public readonly id: string

  public readonly handlerName: string

  public readonly arguments: unknown[]

  public constructor(
    type: OutgoingMessageType,
    id: string,
    handlerName: string,
    args: unknown[]
  ) {
    super(type)

    this.id = id
    this.handlerName = handlerName
    this.arguments = args
  }
}
