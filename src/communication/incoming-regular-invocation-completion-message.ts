import { IncomingMessage } from './incoming-message'

export type IncomingRegularInvocationCompletionMessage = IncomingMessage & {
  readonly invocationId: string
}
