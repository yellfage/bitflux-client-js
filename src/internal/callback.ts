export type Callback<TArgs extends any[] = any[], TResult extends any = any> = (
  ...args: TArgs
) => TResult
