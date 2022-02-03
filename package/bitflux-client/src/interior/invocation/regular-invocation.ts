import type { Invocation } from './invocation'

export interface RegularInvocation<TResult>
  extends Invocation<Promise<TResult>> {}
