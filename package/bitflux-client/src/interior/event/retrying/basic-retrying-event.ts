import type { RetryingEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicInvocationEvent } from '../basic-invocation-event'

export class BasicRetryingEvent
  extends BasicInvocationEvent
  implements RetryingEvent
{
  public delay: number

  public constructor(target: Invocation, delay: number) {
    super(target)

    this.delay = delay
  }
}
