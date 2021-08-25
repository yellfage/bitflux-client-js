import { RegularInvocationSetup } from '../regular-invocation-setup'
import { RegularInvocationShape } from './regular-invocation-shape'

export class RegularInvocationShapeFactory {
  private defaultRejectionDelay: number
  private defaultAttemptRejectionDelay: number

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
