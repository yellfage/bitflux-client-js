import { InvocationSetup } from './invocation-setup'

export type RegularInvocationSetup<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> = InvocationSetup<THandlerName, TArgs> & {
  rejectionDelay: number
  attemptRejectionDelay: number
  abortController: AbortController
}
