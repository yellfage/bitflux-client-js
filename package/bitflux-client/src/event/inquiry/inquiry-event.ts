import type { InvocationEvent } from '../invocation-event'

export interface InquiryEvent<TResult = unknown>
  extends InvocationEvent<TResult> {}
