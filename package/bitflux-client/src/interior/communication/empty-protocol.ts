import type { IncomingMessage, Protocol } from '../../communication'

const ERROR_MESSAGE = 'Unable to acceess to the empty protocol'

export class EmptyProtocol implements Protocol {
  public get name(): string {
    throw new Error(ERROR_MESSAGE)
  }

  public serialize(): string {
    throw new Error(ERROR_MESSAGE)
  }

  public deserialize(): IncomingMessage {
    throw new Error(ERROR_MESSAGE)
  }
}
