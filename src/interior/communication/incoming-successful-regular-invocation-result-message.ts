import { IncomingRegularInvocationResultMessage } from './incoming-regular-invocation-result-message'

export interface IncomingSuccessfulRegularInvocationResultMessage
  extends IncomingRegularInvocationResultMessage {
  readonly value: any
}
