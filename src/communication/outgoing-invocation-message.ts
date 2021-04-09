import { OutgoingMessageType } from './outgoing-message-type'

import { OutgoingMessage } from './outgoing-message'

export class OutgoingInvocationMessage extends OutgoingMessage {
  public readonly handlerName: string
  public readonly args: any[]

  public constructor(
    type: OutgoingMessageType,
    handlerName: string,
    args: any[]
  ) {
    super(type)

    this.handlerName = handlerName
    this.args = args
  }
}
