import type { InvocationEvent } from '../../../event'

import type { Invocation } from '../../invocation'

import { BasicInvocationEvent } from './basic-invocation-event'

import type { InvocationEventFactory } from './invocation-event-factory'

export class BasicInvocationEventFactory implements InvocationEventFactory {
  public create(invocation: Invocation<unknown>): InvocationEvent {
    return new BasicInvocationEvent(invocation)
  }
}
