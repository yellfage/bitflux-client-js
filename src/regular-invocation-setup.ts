import type { InvocationSetup } from './invocation-setup'

export type RegularInvocationSetup<
  THandlerName extends string = string,
  TArgs extends unknown[] = unknown[]
> = InvocationSetup<THandlerName, TArgs> & {
  rejectionDelay?: number
  attemptRejectionDelay?: number
  abortController?: AbortController
}
