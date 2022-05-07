import type { Invocation } from '../../invocation'

export interface InvocationPlugin {
  initialize(invocation: Invocation): void
}
