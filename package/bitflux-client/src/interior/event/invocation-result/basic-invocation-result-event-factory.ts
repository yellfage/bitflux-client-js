import type { InvocationResultEvent } from '../../../event'

import type { Invocation } from '../../invocation'

import { BasicInvocationResultEvent } from './basic-invocation-result-event'

import type { InvocationResultEventFactory } from './invocation-result-event-factory'

export class BasicInvocationResultEventFactory
  implements InvocationResultEventFactory
{
  public create<TResult>(
    result: TResult,
    invocation: Invocation<TResult>,
  ): InvocationResultEvent<TResult> {
    return new BasicInvocationResultEvent(result, invocation)
  }
}
