import { InvocationResult } from './invocation-result'
import { InvocationSetup } from './invocation-setup'

export type InvocationCompletionEvent<
  TPayload = any,
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> = {
  readonly result: InvocationResult<TPayload>
  readonly setup: InvocationSetup<THandlerName, TArgs>
}
