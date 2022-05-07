import type { RetryControl } from './retry-control'

export interface RetryControlBuilder {
  build(): RetryControl
  clone(): RetryControlBuilder
}
