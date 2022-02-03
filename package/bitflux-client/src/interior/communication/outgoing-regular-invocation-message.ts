import { OutgoingMessageType } from '../../communication'

import { OutgoingInvocationMessage } from './outgoing-invocation-message'

export class OutgoingRegularInvocationMessage extends OutgoingInvocationMessage {
  public constructor(id: string, handlerName: string, args: unknown[]) {
    super(OutgoingMessageType.RegularInvocation, id, handlerName, args)
  }
}
