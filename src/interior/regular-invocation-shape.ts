import { InvocationShape } from './invocation-shape'

export interface RegularInvocationShape<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> extends InvocationShape<THandlerName, TArgs> {
  rejectionDelay: number
  attemptRejectionDelay: number
  abortController: AbortController
}
