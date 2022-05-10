import type {
  InvocatingEventPool,
  ReplyingEventPool,
  RetryingEventPool,
} from '../event'

import type { Items } from '../items'

export interface Invocation {
  readonly handlerName: string
  readonly args: unknown[]
  readonly abortController: AbortController

  readonly items: Items

  readonly invocating: InvocatingEventPool
  readonly replying: ReplyingEventPool
  readonly retrying: RetryingEventPool

  perform(): Promise<unknown>
}
