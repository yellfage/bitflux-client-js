import { OutgoingMessageType } from './outgoing-message-type'

import { OutgoingInvocationMessage } from './outgoing-invocation-message'

export class OutgoingRegularInvocationMessage extends OutgoingInvocationMessage {
  public constructor(invocationId: string, handlerName: string, args: any[]) {
    super(
      OutgoingMessageType.RegularInvocation,
      invocationId,
      handlerName,
      args
    )
  }
}
