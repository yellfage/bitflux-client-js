import type { Protocol } from './protocol'

export interface ProtocolBuilder {
  build(): Protocol
}
