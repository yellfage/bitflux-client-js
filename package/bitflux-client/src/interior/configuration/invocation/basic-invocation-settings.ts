import type { InvocationSettings } from '../../../configuration'

import type { RetryControl, RetryDelayScheme } from '../../../retry'

export class BasicInvocationSettings implements InvocationSettings {
  public readonly rejectionDelay: number

  public readonly attemptRejectionDelay: number

  public readonly retryControl: RetryControl

  public readonly retryDelayScheme: RetryDelayScheme

  public constructor(
    rejectionDelay: number,
    attemptRejectionDelay: number,
    retryControl: RetryControl,
    retryDelayScheme: RetryDelayScheme,
  ) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
    this.retryControl = retryControl
    this.retryDelayScheme = retryDelayScheme
  }
}
