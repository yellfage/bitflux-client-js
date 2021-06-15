import { InvocationContext } from './invocation-context'
import { DeferredPromise } from './deferred-promise'
import { Callback } from './callback'

export type RegularInvocationContext = InvocationContext & {
  readonly deferredPromise: DeferredPromise<any>
  rejectionTimeoutId: number
  attemptRejectionTimeoutId: number
  abortionHandler: Callback<[Event]>
}
