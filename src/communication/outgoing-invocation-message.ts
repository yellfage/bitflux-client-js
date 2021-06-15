import { OutgoingMessageType } from './outgoing-message-type'

import { OutgoingMessage } from './outgoing-message'

export class OutgoingInvocationMessage extends OutgoingMessage {
  public readonly invocationId: string
  public readonly handlerName: string
  public readonly args: any[]

  public constructor(
    type: OutgoingMessageType,
    invocationId: string,
    handlerName: string,
    args: any[]
  ) {
    super(type)

    this.invocationId = invocationId
    this.handlerName = handlerName
    this.args = args
  }
}
