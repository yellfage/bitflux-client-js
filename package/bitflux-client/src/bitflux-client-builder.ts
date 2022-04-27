import { EventEmitter } from '@yellfage/event-emitter'

import type { BitfluxClient } from './bitflux-client'

import type {
  CommunicationSettings,
  CommunicationSettingsBuilder,
  LoggingSettingsBuilder,
  RegularInvocationSettingsBuilder,
  ReconnectionSettingsBuilder,
} from './configuration'

import type { EventHandlerMap } from './event'

import {
  BasicBitfluxClient,
  BasicBridge,
  BasicCommunicationSettingsBuilder,
  BasicConnectedBridgeEventFactory,
  BasicConnectedEventFactory,
  BasicConnectingBridgeEventFactory,
  BasicConnectingEventFactory,
  BasicDisconnectedBridgeEventFactory,
  BasicDisconnectedEventFactory,
  BasicDisconnectingBridgeEventFactory,
  BasicDisconnectingEventFactory,
  BasicHandlerMapper,
  BasicInvocationEventFactory,
  BasicInvocationResultEventFactory,
  BasicLoggingSettingsBuilder,
  BasicMessageBridgeEventFactory,
  BasicNotifiableInvocationBuilderFactory,
  BasicReconnectingBridgeEventFactory,
  BasicReconnectingEventFactory,
  BasicReconnectionSettingsBuilder,
  BasicRegularInvocationBuilderFactory,
  BasicRegularInvocationSettingsBuilder,
  MutableState,
} from './interior'

export class BitfluxClientBuilder {
  private readonly url: string | URL

  private readonly communicationSettingsBuilder: CommunicationSettingsBuilder

  private readonly reconnectionSettingsBuilder: ReconnectionSettingsBuilder

  private readonly regularInvocationSettingsBuilder: RegularInvocationSettingsBuilder

  private readonly loggingSettingsBuilder: LoggingSettingsBuilder

  public constructor(url: string | URL)
  public constructor(
    url: string | URL,
    communicationSettingsBuilder: CommunicationSettingsBuilder,
    reconnectionSettingsBuilder: ReconnectionSettingsBuilder,
    regularInvocationSettingsBuilder: RegularInvocationSettingsBuilder,
    loggingSettingsBuilder: LoggingSettingsBuilder,
  )
  public constructor(
    url: string | URL,
    communicationSettingsBuilder: CommunicationSettingsBuilder = new BasicCommunicationSettingsBuilder(),
    reconnectionSettingsBuilder: ReconnectionSettingsBuilder = new BasicReconnectionSettingsBuilder(),
    regularInvocationSettingsBuilder: RegularInvocationSettingsBuilder = new BasicRegularInvocationSettingsBuilder(),
    loggingSettingsBuilder: LoggingSettingsBuilder = new BasicLoggingSettingsBuilder(),
  ) {
    this.url = url
    this.communicationSettingsBuilder = communicationSettingsBuilder
    this.reconnectionSettingsBuilder = reconnectionSettingsBuilder
    this.regularInvocationSettingsBuilder = regularInvocationSettingsBuilder
    this.loggingSettingsBuilder = loggingSettingsBuilder
  }

  public configureCommunication(
    configure: (builder: CommunicationSettingsBuilder) => void,
  ): this {
    configure(this.communicationSettingsBuilder)

    return this
  }

  public configureReconnection(
    configure: (builder: ReconnectionSettingsBuilder) => void,
  ): this {
    configure(this.reconnectionSettingsBuilder)

    return this
  }

  public configureRegularInvocation(
    configure: (builder: RegularInvocationSettingsBuilder) => void,
  ): this {
    configure(this.regularInvocationSettingsBuilder)

    return this
  }

  public configureLogging(
    configure: (builder: LoggingSettingsBuilder) => void,
  ): this {
    configure(this.loggingSettingsBuilder)

    return this
  }

  public build(): BitfluxClient {
    const communicationSettings = this.communicationSettingsBuilder.build()

    const reconnectionSettings = this.reconnectionSettingsBuilder.build()

    const regularInvocationSettings =
      this.regularInvocationSettingsBuilder.build()

    const loggingSettings = this.loggingSettingsBuilder.build()

    this.ensureTransportsProvided(communicationSettings)
    this.ensureProtocolsProvided(communicationSettings)

    const url = new URL(this.url)

    const bridge = new BasicBridge(
      url,
      new MutableState(),
      communicationSettings.transports,
      communicationSettings.protocols,
      new EventEmitter(),
      new BasicConnectingBridgeEventFactory(),
      new BasicConnectedBridgeEventFactory(),
      new BasicDisconnectingBridgeEventFactory(),
      new BasicDisconnectedBridgeEventFactory(),
      new BasicReconnectingBridgeEventFactory(),
      new BasicMessageBridgeEventFactory(),
      loggingSettings.logger,
      reconnectionSettings.control,
      reconnectionSettings.delayScheme,
    )

    const eventEmitter = new EventEmitter<EventHandlerMap>()

    const invocationEventFactory = new BasicInvocationEventFactory()

    const invocationResultEventFactory = new BasicInvocationResultEventFactory()

    return new BasicBitfluxClient(
      bridge,
      eventEmitter,
      new BasicConnectingEventFactory(),
      new BasicConnectedEventFactory(),
      new BasicDisconnectingEventFactory(),
      new BasicDisconnectedEventFactory(),
      new BasicReconnectingEventFactory(),
      new BasicHandlerMapper(bridge, loggingSettings.logger),
      new BasicRegularInvocationBuilderFactory(
        regularInvocationSettings.rejectionDelay,
        regularInvocationSettings.attemptRejectionDelay,
        eventEmitter,
        invocationEventFactory,
        invocationResultEventFactory,
        bridge,
      ),
      new BasicNotifiableInvocationBuilderFactory(
        eventEmitter,
        invocationEventFactory,
        bridge,
      ),
    )
  }

  public clone(url: string | URL): BitfluxClientBuilder {
    return new BitfluxClientBuilder(
      url,
      this.communicationSettingsBuilder.clone(),
      this.reconnectionSettingsBuilder.clone(),
      this.regularInvocationSettingsBuilder.clone(),
      this.loggingSettingsBuilder.clone(),
    )
  }

  private ensureTransportsProvided(settings: CommunicationSettings): void {
    if (!settings.transports.length) {
      throw new Error('At least one transport must be provided')
    }
  }

  private ensureProtocolsProvided(settings: CommunicationSettings): void {
    if (!settings.protocols.length) {
      throw new Error('At least one protocol must be provided')
    }
  }
}
