import { InvocationContext } from './invocation-context'
import { DeferredPromise } from './deferred-promise'
import { Callback } from './callback'

export type RegularInvocationContext = InvocationContext & {
  readonly id: string
  readonly deferredPromise: DeferredPromise<any>
  rejectionTimer: NodeJS.Timeout | null
  attemptRejectionTimer: NodeJS.Timeout | null
  abortionHandler: Callback<[Event]> | null
}
