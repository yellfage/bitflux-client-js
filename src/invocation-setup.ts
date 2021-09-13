export type InvocationSetup<
  THandlerName extends string = string,
  TArgs extends unknown[] = unknown[]
> = {
  handlerName: THandlerName
  args?: TArgs
}
