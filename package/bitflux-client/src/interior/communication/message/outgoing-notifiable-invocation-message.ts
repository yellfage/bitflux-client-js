import { OutgoingMessageType } from '../../../communication'

import { OutgoingInvocationMessage } from './outgoing-invocation-message'

export class OutgoingNotifiableInvocationMessage extends OutgoingInvocationMessage {
  public constructor(handlerName: string, args: unknown[]) {
    super(OutgoingMessageType.NotifiableInvocation, '', handlerName, args)
  }
}
