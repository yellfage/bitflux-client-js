import type { RetryControl } from './retry-control'

export class BasicRetryControl implements RetryControl {
  public confirm(): boolean {
    return false
  }
}
