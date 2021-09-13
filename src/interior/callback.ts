export type Callback<TArgs extends unknown[] = unknown[], TResult = unknown> = (
  ...args: TArgs
) => TResult
