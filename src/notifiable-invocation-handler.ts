export type NotifiableInvocationHandler<TArgs extends any[] = any[]> = (
  ...args: TArgs
) => any
