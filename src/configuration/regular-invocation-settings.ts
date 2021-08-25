export class RegularInvocationSettings {
  public rejectionDelay: number
  public attemptRejectionDelay: number

  public constructor(rejectionDelay = 30000, attemptRejectionDelay = 8000) {
    this.rejectionDelay = rejectionDelay
    this.attemptRejectionDelay = attemptRejectionDelay
  }
}
