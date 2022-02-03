import type { Protocol, ProtocolBuilder } from '@yellfage/bitflux-client'

import { JsonProtocol } from './interior'

export class JsonProtocolBuilder implements ProtocolBuilder {
  public build(): Protocol {
    return new JsonProtocol()
  }
}
