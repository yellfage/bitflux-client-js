import type { InvocationShape } from './invocation-shape'

export interface Invocation<TResult> {
  readonly shape: InvocationShape

  perform(): Promise<TResult>
}
