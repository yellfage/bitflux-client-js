import type { RegularInvocationSetup } from '../regular-invocation-setup'

import type { RegularInvocationShape } from './regular-invocation-shape'

export class RegularInvocationShapeFactory {
  private readonly defaultRejectionDelay: number

  private readonly defaultAttemptRejectionDelay: number

  public constructor(
    defaultRejectionDelay: number,
    defaultAttemptRejectionDelay: number
  ) {
    this.defaultRejectionDelay = defaultRejectionDelay
    this.defaultAttemptRejectionDelay = defaultAttemptRejectionDelay
  }

  public create({
    handlerName,
    args = [],
    rejectionDelay = this.defaultRejectionDelay,
    attemptRejectionDelay = this.defaultAttemptRejectionDelay,
    abortController = new AbortController()
  }: RegularInvocationSetup): RegularInvocationShape {
    return {
      handlerName,
      args,
      rejectionDelay,
      attemptRejectionDelay,
      abortController
    }
  }
}
