import type { InvocationSetup } from './invocation-setup'

export type NotifiableInvocationSetup<
  THandlerName extends string = string,
  TArgs extends unknown[] = unknown[]
> = InvocationSetup<THandlerName, TArgs>
