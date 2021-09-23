export interface ConnectingEvent {
  readonly url: URL

  abort(): void
}
