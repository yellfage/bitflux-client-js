import type { RetryControl, RetryDelayScheme } from '../../invocation'

export interface InvocationSettings {
  readonly rejectionDelay: number
  readonly attemptRejectionDelay: number
  readonly retryControl: RetryControl
  readonly retryDelayScheme: RetryDelayScheme
}
