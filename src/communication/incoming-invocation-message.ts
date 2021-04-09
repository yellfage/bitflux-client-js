import { IncomingMessage } from './incoming-message'

export type IncomingInvocationMessage = IncomingMessage & {
  readonly handlerName: string
  readonly args: any[]
}
