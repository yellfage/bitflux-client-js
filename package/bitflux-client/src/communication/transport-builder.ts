import type { Transport } from './transport'

export interface TransportBuilder {
  build(): Transport
}
