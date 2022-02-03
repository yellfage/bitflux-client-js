import type { Transport, TransportBuilder } from '@yellfage/bitflux-client'

import { EventEmitter } from '@yellfage/event-emitter'

import { PromisfiedWebSocket, WebSocketTransport } from './interior'

import type { WebSocketUrlScheme } from './web-socket-url-scheme'

export class WebSocketTransportBuilder implements TransportBuilder {
  private urlScheme: WebSocketUrlScheme = 'wss'

  public setUrlScheme(scheme: WebSocketUrlScheme): this {
    this.urlScheme = scheme

    return this
  }

  public build(): Transport {
    return new WebSocketTransport(
      new EventEmitter(),
      new PromisfiedWebSocket(),
      this.urlScheme,
    )
  }
}
