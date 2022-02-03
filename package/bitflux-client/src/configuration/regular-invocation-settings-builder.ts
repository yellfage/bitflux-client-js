import { RegularInvocationSettings } from './regular-invocation-settings'

export class RegularInvocationSettingsBuilder {
  private rejectionDelay = 30000

  private attemptRejectionDelay = 8000

  public setRejectionDelay(delay: number): this {
    this.rejectionDelay = delay

    return this
  }

  public setAttemptRejectionDelay(delay: number): this {
    this.attemptRejectionDelay = delay

    return this
  }

  public build(): RegularInvocationSettings {
    return new RegularInvocationSettings(
      this.rejectionDelay,
      this.attemptRejectionDelay,
    )
  }
}
