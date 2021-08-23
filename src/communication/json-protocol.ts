import { Protocol } from './protocol'

export class JsonProtocol implements Protocol {
  public readonly name: string

  public constructor() {
    this.name = 'json'
  }

  public serialize<TMessage>(message: TMessage): string {
    return JSON.stringify(message)
  }

  public deserialize<TMessage>(data: string): TMessage {
    return JSON.parse(data)
  }
}
