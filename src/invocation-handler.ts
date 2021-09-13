export type InvocationHandler<TArgs extends unknown[] = never[]> = (
  ...args: TArgs
) => unknown
