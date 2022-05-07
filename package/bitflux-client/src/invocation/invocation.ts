import type { InquiryEventPool, ReplyEventPool, RetryEventPool } from '../event'

export interface Invocation {
  readonly handlerName: string
  readonly args: unknown[]

  readonly inquiry: InquiryEventPool
  readonly reply: ReplyEventPool
  readonly retry: RetryEventPool

  readonly abortController: AbortController

  perform(): Promise<unknown>
}
