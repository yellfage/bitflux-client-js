import { IncomingMessage } from '../../communication'

export interface IncomingRegularInvocationResultMessage
  extends IncomingMessage {
  readonly invocationId: string
}
