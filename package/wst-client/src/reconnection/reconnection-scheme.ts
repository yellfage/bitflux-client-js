export interface ReconnectionScheme {
  confirm(): boolean
  getNextDelay(attempts: number): number
  reset(): void
}
