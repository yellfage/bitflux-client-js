import type { ErrorReconnectionConfirmationContext } from './error-reconnection-confirmation-context'

import type { ReconnectionConfirmationContext } from './reconnection-confirmation-context'

export interface ReconnectionControl {
  confirm(context: ReconnectionConfirmationContext): boolean
  confirmError(context: ErrorReconnectionConfirmationContext): boolean
}
