import { Callback } from '../internal/callback'
import { ReconnectionAttemptApprovingContext } from './reconnection-attempt-approving-context'

export type ReconnectionSettings = {
  attemptsDelays: number[]
  minAttemptDelayAddition: number
  maxAttemptDelayAddition: number
  maxAttemptsAfterDelays: number
  approveAttempt: Callback<[ReconnectionAttemptApprovingContext], boolean>
}
