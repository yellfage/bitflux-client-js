import type { IncomingMessage } from '../../communication'

export interface IncomingRegularInvocationResultMessage
  extends IncomingMessage {
  readonly id: string
}
