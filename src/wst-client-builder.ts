import type { CommunicationSettings } from 'src'

import {
  CommunicationSettingsBuilder,
  LoggingSettingsBuilder,
  ReconnectionSettingsBuilder,
  RegularInvocationSettingsBuilder
} from './configuration'

import type { WebSocketEventHandlerMap } from './interior'

import {
  Client,
  DefaultWebSocketClient,
  EventEmitter,
  HandlerMapper,
  MutableState,
  NotifiableInvocationFactory,
  NotifiableInvocationShapeFactory,
  PromisfiedWebSocket,
  RegularInvocationFactory,
  RegularInvocationShapeFactory
} from './interior'

import type { WstClient } from './wst-client'

export class WstClientBuilder {
  private readonly communicationSettingsBuilder: CommunicationSettingsBuilder =
    new CommunicationSettingsBuilder()

  private readonly reconnectionSettingsBuilder: ReconnectionSettingsBuilder =
    new ReconnectionSettingsBuilder()

  private readonly regularInvocationSettingsBuilder: RegularInvocationSettingsBuilder =
    new RegularInvocationSettingsBuilder()

  private readonly loggingSettingsBuilder: LoggingSettingsBuilder =
    new LoggingSettingsBuilder()

  private readonly url: string

  public constructor(url: string) {
    this.url = url
  }

  public configureCommunication(
    configure: (
      builder: CommunicationSettingsBuilder
    ) => CommunicationSettingsBuilder
  ): this {
    configure(this.communicationSettingsBuilder)

    return this
  }

  public configureReconnection(
    configure: (
      builder: ReconnectionSettingsBuilder
    ) => ReconnectionSettingsBuilder
  ): this {
    configure(this.reconnectionSettingsBuilder)

    return this
  }

  public configureRegularInvocation(
    configure: (
      builder: RegularInvocationSettingsBuilder
    ) => RegularInvocationSettingsBuilder
  ): this {
    configure(this.regularInvocationSettingsBuilder)

    return this
  }

  public configureLogging(
    configure: (builder: LoggingSettingsBuilder) => LoggingSettingsBuilder
  ): this {
    configure(this.loggingSettingsBuilder)

    return this
  }

  public build(): WstClient {
    const communicationSettings = this.communicationSettingsBuilder.build()

    const reconnectionSettings = this.reconnectionSettingsBuilder.build()

    const regularInvocationSettings =
      this.regularInvocationSettingsBuilder.build()

    const loggingSettings = this.loggingSettingsBuilder.build()

    const subProtocolNames = this.resolveSubProtocolNames(communicationSettings)

    const eventEmitter = new EventEmitter<WebSocketEventHandlerMap>()

    const webSocket = new DefaultWebSocketClient(
      this.url,
      new MutableState(),
      loggingSettings.logger,
      eventEmitter,
      communicationSettings.protocols,
      reconnectionSettings.scheme,
      new PromisfiedWebSocket(subProtocolNames)
    )

    return new Client(
      webSocket,
      new HandlerMapper(webSocket, loggingSettings.logger),
      eventEmitter,
      new RegularInvocationShapeFactory(
        regularInvocationSettings.rejectionDelay,
        regularInvocationSettings.attemptRejectionDelay
      ),
      new NotifiableInvocationShapeFactory(),
      new RegularInvocationFactory(webSocket),
      new NotifiableInvocationFactory(webSocket)
    )
  }

  private resolveSubProtocolNames(settings: CommunicationSettings): string[] {
    return settings.protocols.map((protocol) => protocol.name)
  }
}
