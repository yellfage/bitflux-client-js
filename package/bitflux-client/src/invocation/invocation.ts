import type {
  InvocatingEventPool,
  ReplyingEventPool,
  RetryingEventPool,
} from '../event'

export interface Invocation {
  readonly handlerName: string
  readonly args: unknown[]
  readonly abortController: AbortController

  readonly invocating: InvocatingEventPool
  readonly replying: ReplyingEventPool
  readonly retrying: RetryingEventPool

  perform(): Promise<unknown>
}
