export interface ReconnectionDelayScheme {
  moveNext(): number
  reset(): void
}
