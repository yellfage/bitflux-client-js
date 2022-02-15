import type { ReconnectionConfirmationContext } from './reconnection-confirmation-context'

export interface ErrorReconnectionConfirmationContext
  extends ReconnectionConfirmationContext {
  readonly error: unknown
}
