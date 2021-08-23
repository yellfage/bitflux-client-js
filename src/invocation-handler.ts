export type InvocationHandler<TArgs extends any[] = any[]> = (
  ...args: TArgs
) => any
