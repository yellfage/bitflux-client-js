import type { ReplyEvent } from '../../../event'

import type { Invocation } from '../../invocation'

import { BasicInvocationEvent } from '../basic-invocation-event'

export class BasicReplyEvent<TResult>
  extends BasicInvocationEvent<TResult>
  implements ReplyEvent<TResult>
{
  public result: TResult

  public constructor(target: Invocation<TResult>, result: TResult) {
    super(target)

    this.result = result
  }

  public replaceResult(result: TResult): void {
    this.result = result
  }
}
