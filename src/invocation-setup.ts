export interface InvocationSetup<
  THandlerName extends string = string,
  TArgs extends any[] = any[]
> {
  handlerName: THandlerName
  args?: TArgs
}
