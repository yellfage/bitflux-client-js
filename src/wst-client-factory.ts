import { JsonProtocol } from './communication'

import type { WebSocketEventHandlerMap } from './interior'

import {
  isString,
  isFunction,
  validateWstClientFactoryOptions,
  Client,
  DefaultWebSocketClient,
  MutableState,
  EventEmitter,
  HandlerMapper,
  RegularInvocationShapeFactory,
  NotifiableInvocationShapeFactory,
  RegularInvocationFactory,
  NotifiableInvocationFactory,
  PromisfiedWebSocket
} from './interior'

import type { WstClient } from './wst-client'

import { WstClientFactoryOptions } from './wst-client-factory-options'

export class WstClientFactory {
  public create(
    url: string,
    configure: (options: WstClientFactoryOptions) => void = () => {}
  ): WstClient {
    if (!isString(url)) {
      throw new TypeError(
        'Invalid type of the "url" parameter. Expected type: string'
      )
    }

    if (!isFunction(configure)) {
      throw new TypeError(
        'Invalid type of the "configure" parameter. Expected type: function'
      )
    }

    const options = new WstClientFactoryOptions()

    configure(options)

    if (!options.communication.protocols.length) {
      options.communication.protocols.push(new JsonProtocol())
    }

    validateWstClientFactoryOptions(options)

    return this.createCore(url, options)
  }

  private createCore(url: string, options: WstClientFactoryOptions): WstClient {
    const { logger } = options.logging

    const subProtocolNames = options.communication.protocols.map(
      (protocol) => protocol.name
    )

    const eventEmitter = new EventEmitter<WebSocketEventHandlerMap>()

    const webSocket = new DefaultWebSocketClient(
      url,
      new MutableState(),
      logger,
      eventEmitter,
      options.communication.protocols,
      options.reconnection.scheme,
      new PromisfiedWebSocket(subProtocolNames)
    )

    return new Client(
      webSocket,
      new HandlerMapper(webSocket, logger),
      eventEmitter,
      new RegularInvocationShapeFactory(
        options.regularInvocation.rejectionDelay,
        options.regularInvocation.attemptRejectionDelay
      ),
      new NotifiableInvocationShapeFactory(),
      new RegularInvocationFactory(webSocket),
      new NotifiableInvocationFactory(webSocket)
    )
  }
}
