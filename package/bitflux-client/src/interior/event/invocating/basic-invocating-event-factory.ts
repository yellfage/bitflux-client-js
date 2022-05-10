import type { InvocatingEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicInvocatingEvent } from './basic-invocating-event'

import type { InvocatingEventFactory } from './invocating-event-factory'

export class BasicInvocatingEventFactory implements InvocatingEventFactory {
  public create(target: Invocation): InvocatingEvent {
    return new BasicInvocatingEvent(target)
  }
}
