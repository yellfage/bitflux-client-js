import type {
  InvocationEventPool,
  InvocationResultEventPool,
} from '../../event'

import type { InvocationShape } from './invocation-shape'

export interface Invocation<TResult> {
  readonly shape: InvocationShape

  readonly invocation: InvocationEventPool
  readonly invocationResult: InvocationResultEventPool

  perform(): Promise<TResult>
}
