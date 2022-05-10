import type { ReplyingEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicInvocationEvent } from '../basic-invocation-event'

export class BasicReplyingEvent
  extends BasicInvocationEvent
  implements ReplyingEvent
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
