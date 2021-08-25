import { WstClient } from './wst-client'
import { WstClientFactoryOptions } from './wst-client-factory-options'

import {
  StringUtils,
  FunctionUtils,
  WstClientFactoryOptionsValidator,
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

import { JsonProtocol } from './communication'
import { Events } from './events'

export class WstClientFactory {
  public create(
    url: string,
    configure: (options: WstClientFactoryOptions) => void
  ): WstClient {
    if (!StringUtils.isString(url)) {
      throw new TypeError(
        'Invalid type of the "url" parameter. Expected type: string'
      )
    }

    if (configure !== undefined && !FunctionUtils.isFunction(configure)) {
      throw new TypeError(
        'Invalid type of the "configure" parameter. Expected type: function'
      )
    }

    const options = new WstClientFactoryOptions()

    if (configure) {
      configure(options)
    }

    if (!options.communication.protocols.length) {
      options.communication.protocols.push(new JsonProtocol())
    }

    WstClientFactoryOptionsValidator.validate(options)

    return this.createCore(url, options)
  }

  private createCore(url: string, options: WstClientFactoryOptions): WstClient {
    const { logger } = options.logging

    const subProtocolNames = options.communication.protocols.map(
      (protocol) => protocol.name
    )

    const eventEmitter = new EventEmitter<Events>()

    const webSocket = new DefaultWebSocketClient(
      new MutableState(),
      logger,
      eventEmitter,
      options.communication.protocols,
      options.reconnection.policy,
      new PromisfiedWebSocket(url, subProtocolNames)
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
