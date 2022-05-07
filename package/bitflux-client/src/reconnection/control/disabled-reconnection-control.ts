import type { ReconnectionControl } from './reconnection-control'

export class DisabledReconnectionControl implements ReconnectionControl {
  public confirm(): boolean {
    return false
  }
}
