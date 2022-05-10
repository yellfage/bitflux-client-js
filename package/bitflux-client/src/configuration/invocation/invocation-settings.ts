import type { RetryControl, RetryDelayScheme } from '../../retry'

export interface InvocationSettings {
  readonly rejectionDelay: number
  readonly attemptRejectionDelay: number
  readonly retryControl: RetryControl
  readonly retryDelayScheme: RetryDelayScheme
}
