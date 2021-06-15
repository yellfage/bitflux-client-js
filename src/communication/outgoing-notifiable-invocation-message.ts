import { OutgoingMessageType } from './outgoing-message-type'

import { OutgoingInvocationMessage } from './outgoing-invocation-message'

export class OutgoingNotifiableInvocationMessage extends OutgoingInvocationMessage {
  public constructor(invocationId: string, handlerName: string, args: any[]) {
    super(
      OutgoingMessageType.NotifiableInvocation,
      invocationId,
      handlerName,
      args
    )
  }
}
