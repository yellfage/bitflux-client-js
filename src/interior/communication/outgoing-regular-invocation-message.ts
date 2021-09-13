import { OutgoingMessageType } from '../../communication'

import { OutgoingInvocationMessage } from './outgoing-invocation-message'

export class OutgoingRegularInvocationMessage extends OutgoingInvocationMessage {
  public readonly invocationId: string

  public constructor(
    handlerName: string,
    args: unknown[],
    invocationId: string
  ) {
    super(OutgoingMessageType.RegularInvocation, handlerName, args)

    this.invocationId = invocationId
  }
}
