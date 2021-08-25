import { InvocationSetup } from './invocation-setup'

export interface RegularInvocationSetup<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> extends InvocationSetup<THandlerName, TArgs> {
  rejectionDelay?: number
  attemptRejectionDelay?: number
  abortController?: AbortController
}
