import { nanoid } from 'nanoid'

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
    return new RegularInvocationShape(
      handlerName,
      args,
      nanoid(),
      rejectionDelay,
      attemptRejectionDelay,
      abortController
    )
  }
}
