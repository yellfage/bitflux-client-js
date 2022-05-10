export interface RetryDelayScheme {
  moveNext(): number
  clone(): RetryDelayScheme
}
