import type { Items } from '../items'

export class BasicItems implements Items {
  private readonly map = new Map<unknown, unknown>()

  public get<TValue>(key: string): TValue {
    return this.map.get(key) as TValue
  }

  public set<TValue = unknown>(key: string, value: TValue): this {
    this.map.set(key, value)

    return this
  }

  public delete(key: string): boolean {
    return this.map.delete(key)
  }

  public has(key: string): boolean {
    return this.map.has(key)
  }
}
