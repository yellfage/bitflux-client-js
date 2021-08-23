export abstract class InvocationShape<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> {
  public handlerName: THandlerName
  public args: TArgs

  public constructor(handlerName: THandlerName, args: TArgs) {
    this.handlerName = handlerName
    this.args = args
  }
}
