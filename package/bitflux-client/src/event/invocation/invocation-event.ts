import type { Invocation } from '../../interior'

export interface InvocationEvent<TResult = unknown> {
  readonly invocation: Invocation<TResult>
}
