import { OutgoingInvocationMessage } from './outgoing-invocation-message'

import { OutgoingMessageType } from '../../communication'

export class OutgoingNotifiableInvocationMessage extends OutgoingInvocationMessage {
  public constructor(handlerName: string, args: any[]) {
    super(OutgoingMessageType.NotifiableInvocation, handlerName, args)
  }
}
