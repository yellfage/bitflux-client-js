import type { IncomingRegularInvocationResultMessage } from './incoming-regular-invocation-result-message'

export interface IncomingFailedRegularInvocationResultMessage
  extends IncomingRegularInvocationResultMessage {
  readonly error: string
}
