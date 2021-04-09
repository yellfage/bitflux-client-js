import { InvocationSetup } from './invocation-setup'

export type InvocationEvent<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> = {
  readonly setup: InvocationSetup<THandlerName, TArgs>
}
