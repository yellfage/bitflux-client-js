import { IncomingRegularInvocationCompletionMessage } from './incoming-regular-invocation-completion-message'

export type IncomingFailedRegularInvocationCompletionMessage = IncomingRegularInvocationCompletionMessage & {
  readonly error: string
}
