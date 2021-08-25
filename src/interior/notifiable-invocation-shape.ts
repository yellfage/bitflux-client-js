/* eslint-disable @typescript-eslint/no-empty-interface */

import { InvocationShape } from './invocation-shape'

export interface NotifiableInvocationShape<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> extends InvocationShape<THandlerName, TArgs> {}
