import { NotifiableInvocationSetup } from './notifiable-invocation-setup'

export type NotifiableInvocationSetupCallback<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> = (setup: NotifiableInvocationSetup<THandlerName, TArgs>) => void
