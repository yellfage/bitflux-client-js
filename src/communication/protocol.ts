export interface Protocol {
  readonly name: string

  serialize(message: any): string | ArrayBufferLike | ArrayBufferView | Blob

  deserialize<TMessage = any>(data: any): TMessage
}
