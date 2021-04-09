export type IncomingInvocationEvent<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> = {
  readonly handlerName: THandlerName
  readonly args: TArgs
}
