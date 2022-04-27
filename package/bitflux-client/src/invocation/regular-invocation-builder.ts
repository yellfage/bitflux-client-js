import type { InvocationBuilder } from './invocation-builder'

export interface RegularInvocationBuilder<TResult>
  extends InvocationBuilder<TResult> {
  setRejectionDelay(delay: number): this
  setAttemptRejectionDelay(delay: number): this
  setAbortController(controller: AbortController): this
}
