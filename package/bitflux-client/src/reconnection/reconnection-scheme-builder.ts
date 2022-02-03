import type { ReconnectionScheme } from './reconnection-scheme'

export interface ReconnectionSchemeBuilder {
  build(): ReconnectionScheme
}
