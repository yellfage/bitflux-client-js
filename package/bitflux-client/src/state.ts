export interface State {
  readonly currentName: string
  readonly isConnecting: boolean
  readonly isConnected: boolean
  readonly isDisconnecting: boolean
  readonly isDisconnected: boolean
  readonly isReconnecting: boolean
}
