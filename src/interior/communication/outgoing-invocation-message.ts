import { OutgoingMessage, OutgoingMessageType } from '../../communication'

export class OutgoingInvocationMessage extends OutgoingMessage {
  public readonly handlerName: string
  public readonly arguments: any[]

  public constructor(
    type: OutgoingMessageType,
    handlerName: string,
    args: any[]
  ) {
    super(type)

    this.handlerName = handlerName
    this.arguments = args
  }
}
