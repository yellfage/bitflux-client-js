import { InvocationDescriptor } from './invocation-descriptor'
import { NotifiableInvocationContext } from './notifiable-invocation-context'
import { NotifiableInvocationSetup } from '../notifiable-invocation-setup'

export type NotifiableInvocationDescriptor = InvocationDescriptor & {
  readonly setup: NotifiableInvocationSetup
  readonly context: NotifiableInvocationContext
}
