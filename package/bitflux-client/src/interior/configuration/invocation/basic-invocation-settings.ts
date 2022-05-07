import type { InvocationSettings } from '../../../configuration'

export class BasicInvocationSettings implements InvocationSettings {
  public readonly rejectionDelay: number

  public readonly attemptRejectionDelay: number

  public constructor(rejectionDelay: number, attemptRejectionDelay: number) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
  }
}
