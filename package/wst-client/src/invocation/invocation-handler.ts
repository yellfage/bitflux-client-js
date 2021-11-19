export type InvocationHandler<TArgs extends never[] = never[]> = (
  ...args: TArgs
) => unknown
