import { InvocationShape } from './invocation-shape'

export class NotifiableInvocationShape<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> extends InvocationShape<THandlerName, TArgs> {}
