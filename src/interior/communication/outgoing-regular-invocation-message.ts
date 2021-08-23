import { OutgoingInvocationMessage } from './outgoing-invocation-message'

import { OutgoingMessageType } from '../../communication'

export class OutgoingRegularInvocationMessage extends OutgoingInvocationMessage {
  public readonly invocationId: string

  public constructor(handlerName: string, args: any[], invocationId: string) {
    super(OutgoingMessageType.RegularInvocation, handlerName, args)

    this.invocationId = invocationId
  }
}
