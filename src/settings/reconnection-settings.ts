import { Callback } from '../internal/callback'
import { ReconnectionConfirmationContext } from './reconnection-confirmation-context'

export type ReconnectionSettings = {
  attemptsDelays: number[]
  minAttemptDelayAddition: number
  maxAttemptDelayAddition: number
  maxAttemptsAfterDelays: number
  confirm: Callback<[ReconnectionConfirmationContext], boolean>
}
