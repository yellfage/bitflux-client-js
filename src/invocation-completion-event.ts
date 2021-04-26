import { InvocationResult } from './invocation-result'
import { InvocationSetup } from './invocation-setup'

export type InvocationCompletionEvent<
  TData = any,
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> = {
  readonly result: InvocationResult<TData>
  readonly setup: InvocationSetup<THandlerName, TArgs>
}
