import type { InvocationPluginBuilder } from '../plugin'

export interface InvocationBuilder<TResult> {
  use(builder: InvocationPluginBuilder): this
  setArgs(...args: unknown[]): this
  setAbortController(controller: AbortController): this
  setRejectionDelay(delay: number): this
  setAttemptRejectionDelay(delay: number): this
  perform(): Promise<TResult>
}
