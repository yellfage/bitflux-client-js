import type { RetryDelayScheme } from './retry-delay-scheme'

export interface RetryDelaySchemeBuilder {
  build(): RetryDelayScheme
}
