export class RegularInvocationSettings {
  public readonly rejectionDelay: number

  public readonly attemptRejectionDelay: number

  public constructor(rejectionDelay: number, attemptRejectionDelay: number) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
  }
}
