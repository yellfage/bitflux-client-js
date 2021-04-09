import { RegularInvocationSetup } from './regular-invocation-setup'

export type RegularInvocationSetupCallback<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> = (setup: RegularInvocationSetup<THandlerName, TArgs>) => void
