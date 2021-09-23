export interface ConnectingEvent {
  readonly url: URL
  readonly abort: () => void
}
