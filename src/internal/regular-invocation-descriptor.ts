import { InvocationDescriptor } from './invocation-descriptor'
import { RegularInvocationContext } from './regular-invocation-context'
import { RegularInvocationSetup } from '../regular-invocation-setup'

export type RegularInvocationDescriptor = InvocationDescriptor & {
  readonly setup: RegularInvocationSetup
  readonly context: RegularInvocationContext
}
