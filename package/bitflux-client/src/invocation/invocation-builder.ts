import type { InvocationPluginBuilder } from '../plugin'

import type { RetryControlBuilder, RetryDelaySchemeBuilder } from './retry'

export interface InvocationBuilder<TResult> {
  use(builder: InvocationPluginBuilder): this
  setAbortController(controller: AbortController): this
  setRejectionDelay(delay: number): this
  setAttemptRejectionDelay(delay: number): this
  setRetryControl(builder: RetryControlBuilder): this
  setRetryDelayScheme(builder: RetryDelaySchemeBuilder): this
  perform(): Promise<TResult>
}
