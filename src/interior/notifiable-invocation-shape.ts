import type { InvocationShape } from './invocation-shape'

export interface NotifiableInvocationShape<
  THandlerName extends string = string,
  TArgs extends unknown[] = unknown[]
> extends InvocationShape<THandlerName, TArgs> {}
