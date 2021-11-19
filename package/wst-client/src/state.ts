export interface State {
  readonly isDisconnected: boolean
  readonly isConnecting: boolean
  readonly isConnected: boolean
  readonly isReconnecting: boolean
  readonly isTerminating: boolean
  readonly isTerminated: boolean
}
