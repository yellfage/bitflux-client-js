import type { InvocationShape } from '../invocation-shape'

export interface RegularInvocationShape extends InvocationShape {
  readonly id: string
  readonly rejectionDelay: number
  readonly attemptRejectionDelay: number
  readonly abortController: AbortController
}
