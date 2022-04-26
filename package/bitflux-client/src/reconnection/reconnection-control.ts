import type { ReconnectionConfirmationContext } from './reconnection-confirmation-context'

export interface ReconnectionControl {
  confirm(context: ReconnectionConfirmationContext): boolean
}
