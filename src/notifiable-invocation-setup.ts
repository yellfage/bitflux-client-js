import { InvocationSetup } from './invocation-setup'

export type NotifiableInvocationSetup<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> = InvocationSetup<THandlerName, TArgs>
