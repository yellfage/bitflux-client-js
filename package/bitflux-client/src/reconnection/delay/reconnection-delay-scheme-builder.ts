import type { ReconnectionDelayScheme } from './reconnection-delay-scheme'

export interface ReconnectionDelaySchemeBuilder {
  build(): ReconnectionDelayScheme
}
