import { OutgoingMessageType } from './outgoing-message-type'

import { OutgoingInvocationMessage } from './outgoing-invocation-message'

export class OutgoingNotifiableInvocationMessage extends OutgoingInvocationMessage {
  public constructor(handlerName: string, args: any[]) {
    super(OutgoingMessageType.NotifiableInvocation, handlerName, args)
  }
}
