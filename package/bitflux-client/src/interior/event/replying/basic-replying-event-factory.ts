import type { ReplyingEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicReplyingEvent } from './basic-replying-event'

import type { ReplyingEventFactory } from './replying-event-factory'

export class BasicReplyingEventFactory implements ReplyingEventFactory {
  public create(target: Invocation, result: unknown): ReplyingEvent {
    return new BasicReplyingEvent(target, result)
  }
}
