import type { ReplyEvent } from '../../../event'

import type { Invocation } from '../../invocation'

import { BasicReplyEvent } from './basic-reply-event'

import type { ReplyEventFactory } from './reply-event-factory'

export class BasicReplyEventFactory implements ReplyEventFactory {
  public create<TResult>(
    target: Invocation<TResult>,
    result: TResult,
  ): ReplyEvent<TResult> {
    return new BasicReplyEvent(target, result)
  }
}
