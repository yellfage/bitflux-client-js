import type { InvocationResultEvent } from '../../../event'

import type { Invocation } from '../../invocation'

export class BasicInvocationResultEvent<TResult>
  implements InvocationResultEvent<TResult>
{
  public result: TResult

  public readonly invocation: Invocation<TResult>

  public constructor(result: TResult, invocation: Invocation<TResult>) {
    this.result = result
    this.invocation = invocation
  }

  public replaceResult(result: TResult): void {
    this.result = result
  }
}
