import type { ReconnectionScheme } from './reconnection-scheme'

export class DisabledReconnectionScheme implements ReconnectionScheme {
  public confirm(): boolean {
    return false
  }

  public getNextDelay(): number {
    return 0
  }

  public reset(): void {
    //
  }
}
