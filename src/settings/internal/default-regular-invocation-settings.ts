/* eslint-disable indent */

import { InvocationSettings } from '../invocation-settings'

export class DefaultRegularInvocationSettings implements InvocationSettings {
  public rejectionDelay: number
  public attemptRejectionDelay: number

  public constructor() {
    this.rejectionDelay = 30000
    this.attemptRejectionDelay = 10000
  }
}
