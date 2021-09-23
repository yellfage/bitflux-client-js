import type { DisconnectionCode } from '../communication'

export interface DefaultReconnectionPolicyOptions {
  readonly delays?: number[]
  readonly minDelayOffset?: number
  readonly maxDelayOffset?: number
  readonly maxAttemptsAfterDelays?: number
  readonly reconnectableCodes?: DisconnectionCode[]
}
