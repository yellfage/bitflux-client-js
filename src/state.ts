export interface State {
  readonly isConnecting: boolean
  readonly isConnected: boolean
  readonly isReconnecting: boolean
  readonly isDisconnected: boolean
  readonly isTerminating: boolean
  readonly isTerminated: boolean
}
