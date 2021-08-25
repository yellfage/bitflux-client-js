/* eslint-disable @typescript-eslint/no-empty-interface */

import { InvocationSetup } from './invocation-setup'

export interface NotifiableInvocationSetup<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> extends InvocationSetup<THandlerName, TArgs> {}
