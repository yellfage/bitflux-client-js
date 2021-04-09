import { InvocationSetup } from '../invocation-setup'
import { InvocationContext } from './invocation-context'

export type InvocationDescriptor = {
  readonly setup: InvocationSetup
  readonly context: InvocationContext
}
