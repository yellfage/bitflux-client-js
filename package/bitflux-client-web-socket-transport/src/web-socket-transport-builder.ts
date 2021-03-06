import type { Transport, TransportBuilder } from '@yellfage/bitflux-client'

import { WebSocketTransport } from './interior'

import type { WebSocketUrlScheme } from './web-socket-url-scheme'

export class WebSocketTransportBuilder implements TransportBuilder {
  private urlScheme: WebSocketUrlScheme = 'wss'

  public setUrlScheme(scheme: WebSocketUrlScheme): this {
    this.urlScheme = scheme

    return this
  }

  public build(): Transport {
    return new WebSocketTransport(this.urlScheme)
  }
}
