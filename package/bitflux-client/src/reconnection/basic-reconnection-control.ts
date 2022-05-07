import type { ReconnectionControl } from './reconnection-control'

export class BasicReconnectionControl implements ReconnectionControl {
  private readonly maxAttempts: number

  public constructor(maxAttempts: number) {
    this.maxAttempts = maxAttempts
  }

  public confirm(attempts: number): boolean {
    return this.maxAttempts < 0 || attempts < this.maxAttempts
  }
}
