import { InvocationSetup } from './invocation-setup'

export class NotifiableInvocationSetup<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> extends InvocationSetup<THandlerName, TArgs> {
  public static validate(setup: NotifiableInvocationSetup): void {
    InvocationSetup.validate(setup)
  }
}
