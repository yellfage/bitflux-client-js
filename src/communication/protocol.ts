export interface Protocol {
  readonly name: string

  serialize(message: unknown): ArrayBufferLike | ArrayBufferView | Blob | string
  deserialize<TMessage = unknown>(data: unknown): TMessage
}
