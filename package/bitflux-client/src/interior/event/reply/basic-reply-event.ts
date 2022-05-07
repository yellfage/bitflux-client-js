import type { ReplyEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicInvocationEvent } from '../basic-invocation-event'

export class BasicReplyEvent
  extends BasicInvocationEvent
  implements ReplyEvent
{
  public result: unknown

  public constructor(target: Invocation, result: unknown) {
    super(target)

    this.result = result
  }

  public replaceResult(result: unknown): void {
    this.result = result
  }
}
