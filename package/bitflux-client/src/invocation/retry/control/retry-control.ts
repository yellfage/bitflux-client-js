export interface RetryControl {
  confirm(result: unknown): boolean
  clone(): RetryControl
}
