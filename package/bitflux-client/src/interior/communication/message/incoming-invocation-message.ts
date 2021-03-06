import type { IncomingMessage } from '../../../communication'

export interface IncomingInvocationMessage extends IncomingMessage {
  readonly handlerName: string
  readonly arguments: never[]
}
