export interface InvocationShape<
  THandlerName extends string = string,
  TArgs extends unknown[] = unknown[]
> {
  readonly handlerName: THandlerName
  readonly args: TArgs
}
