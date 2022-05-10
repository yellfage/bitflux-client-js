export interface Items {
  get<TValue = unknown>(key: unknown): TValue
  set<TValue = unknown>(key: unknown, value: TValue): this
  delete(key: unknown): boolean
  has(key: unknown): boolean
}
