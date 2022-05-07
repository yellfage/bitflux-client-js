import type { ReplyEvent } from '../../../event'

import type { Invocation } from '../../../invocation'

import { BasicReplyEvent } from './basic-reply-event'

import type { ReplyEventFactory } from './reply-event-factory'

export class BasicReplyEventFactory implements ReplyEventFactory {
  public create(target: Invocation, result: unknown): ReplyEvent {
    return new BasicReplyEvent(target, result)
  }
}
