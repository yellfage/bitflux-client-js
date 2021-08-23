import { StringUtils } from './interior/string-utils'

export abstract class InvocationSetup<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> {
  public handlerName: THandlerName
  public args?: TArgs

  public constructor(handlerName: THandlerName, args?: TArgs) {
    this.handlerName = handlerName
    this.args = args
  }

  public static validate(setup: InvocationSetup): void {
    if (!StringUtils.isString(setup.handlerName)) {
      throw new TypeError(
        'Invalid invocation setup: the "handlerName" field must be a string'
      )
    }

    if (setup.args !== undefined && !Array.isArray(setup.args)) {
      throw new TypeError(
        'Invalid invocation setup: the "args" field must be an array'
      )
    }
  }
}
