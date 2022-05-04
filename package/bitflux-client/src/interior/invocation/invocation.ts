import type { InquiryEventPool, ReplyEventPool } from '../../event'

import type { InvocationShape } from './invocation-shape'

export interface Invocation<TResult> {
  readonly shape: InvocationShape

  readonly inquiry: InquiryEventPool
  readonly reply: ReplyEventPool

  perform(): Promise<TResult>
}
