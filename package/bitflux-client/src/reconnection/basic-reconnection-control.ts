import type { ErrorReconnectionConfirmationContext } from './error-reconnection-confirmation-context'

import type { ReconnectionConfirmationContext } from './reconnection-confirmation-context'

import type { ReconnectionControl } from './reconnection-control'

export class BasicReconnectionControl implements ReconnectionControl {
  private readonly maxAttempts: number

  public constructor(maxAttempts: number) {
    this.maxAttempts = maxAttempts
  }

  public confirm({ attempts }: ReconnectionConfirmationContext): boolean {
    return this.maxAttempts < 0 || attempts < this.maxAttempts
  }

  public confirmError(context: ErrorReconnectionConfirmationContext): boolean {
    return this.confirm(context)
  }
}
