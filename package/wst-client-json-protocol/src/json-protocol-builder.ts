import type { Protocol, ProtocolBuilder } from '@yellfage/wst-client'

import { JsonProtocol } from './interior'

export class JsonProtocolBuilder implements ProtocolBuilder {
  public build(): Protocol {
    return new JsonProtocol()
  }
}
