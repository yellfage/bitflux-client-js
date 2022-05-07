import type { InquiryEventPool, ReplyEventPool } from '../event'

export interface Invocation {
  readonly handlerName: string
  readonly args: unknown[]

  readonly inquiry: InquiryEventPool
  readonly reply: ReplyEventPool

  readonly abortController: AbortController

  perform(): Promise<unknown>
}
