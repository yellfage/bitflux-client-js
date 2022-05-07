import type { RetryEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicInvocationEvent } from '../basic-invocation-event'

export class BasicRetryEvent
  extends BasicInvocationEvent
  implements RetryEvent
{
  public delay: number

  public constructor(target: Invocation, delay: number) {
    super(target)

    this.delay = delay
  }
}
