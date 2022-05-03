import { BasicEventChannel } from '@yellfage/events'

import type { BitfluxClient } from './bitflux-client'

import type {
  CommunicationSettings,
  CommunicationSettingsBuilder,
  LoggingSettingsBuilder,
  RegularInvocationSettingsBuilder,
  ReconnectionSettingsBuilder,
} from './configuration'

import type {
  ConnectedBridgeEventChannel,
  ConnectedEventChannel,
  ConnectingBridgeEventChannel,
  ConnectingEventChannel,
  DisconnectedBridgeEventChannel,
  DisconnectedEventChannel,
  DisconnectingBridgeEventChannel,
  DisconnectingEventChannel,
  InvocationEventChannel,
  InvocationResultEventChannel,
  MessageBridgeEventChannel,
  ReconnectingBridgeEventChannel,
  ReconnectingEventChannel,
} from './interior'

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

    const state = new MutableState()

    const connectingBridgeEventChannel: ConnectingBridgeEventChannel =
      new BasicEventChannel()

    const connectedBridgeEventChannel: ConnectedBridgeEventChannel =
      new BasicEventChannel()

    const disconnectingBridgeEventChannel: DisconnectingBridgeEventChannel =
      new BasicEventChannel()

    const disconnectedBridgeEventChannel: DisconnectedBridgeEventChannel =
      new BasicEventChannel()

    const reconnectingBridgeEventChannel: ReconnectingBridgeEventChannel =
      new BasicEventChannel()

    const messageBridgeEventChannel: MessageBridgeEventChannel =
      new BasicEventChannel()

    const connectingBridgeEventFactory = new BasicConnectingBridgeEventFactory()

    const connectedBridgeEventFactory = new BasicConnectedBridgeEventFactory()

    const disconnectingBridgeEventFactory =
      new BasicDisconnectingBridgeEventFactory()

    const disconnectedBridgeEventFactory =
      new BasicDisconnectedBridgeEventFactory()

    const reconnectingBridgeEventFactory =
      new BasicReconnectingBridgeEventFactory()

    const messageBridgeEventFactory = new BasicMessageBridgeEventFactory()

    const bridge = new BasicBridge(
      url,
      state,
      connectingBridgeEventChannel,
      connectedBridgeEventChannel,
      disconnectingBridgeEventChannel,
      disconnectedBridgeEventChannel,
      reconnectingBridgeEventChannel,
      messageBridgeEventChannel,
      connectingBridgeEventFactory,
      connectedBridgeEventFactory,
      disconnectingBridgeEventFactory,
      disconnectedBridgeEventFactory,
      reconnectingBridgeEventFactory,
      messageBridgeEventFactory,
      communicationSettings.transports,
      communicationSettings.protocols,
      reconnectionSettings.control,
      reconnectionSettings.delayScheme,
      loggingSettings.logger,
    )

    const connectingEventChannel: ConnectingEventChannel =
      new BasicEventChannel()

    const connectedEventChannel: ConnectedEventChannel = new BasicEventChannel()

    const disconnectingEventChannel: DisconnectingEventChannel =
      new BasicEventChannel()

    const disconnectedEventChannel: DisconnectedEventChannel =
      new BasicEventChannel()

    const reconnectingEventChannel: ReconnectingEventChannel =
      new BasicEventChannel()

    const invocationEventChannel: InvocationEventChannel =
      new BasicEventChannel()

    const invocationResultEventChannel: InvocationResultEventChannel =
      new BasicEventChannel()

    const connectingEventFactory = new BasicConnectingEventFactory()

    const connectedEventFactory = new BasicConnectedEventFactory()

    const disconnectingEventFactory = new BasicDisconnectingEventFactory()

    const disconnectedEventFactory = new BasicDisconnectedEventFactory()

    const reconnectingEventFactory = new BasicReconnectingEventFactory()

    const invocationEventFactory = new BasicInvocationEventFactory()

    const invocationResultEventFactory = new BasicInvocationResultEventFactory()

    const handlerMapper = new BasicHandlerMapper(bridge, loggingSettings.logger)

    const regularInvocationBuilderFactory =
      new BasicRegularInvocationBuilderFactory(
        regularInvocationSettings.rejectionDelay,
        regularInvocationSettings.attemptRejectionDelay,
        invocationEventChannel,
        invocationResultEventChannel,
        invocationEventFactory,
        invocationResultEventFactory,
        bridge,
      )

    const notifiableInvocationBuilderFactory =
      new BasicNotifiableInvocationBuilderFactory(
        invocationEventChannel,
        invocationResultEventChannel,
        invocationEventFactory,
        bridge,
      )

    return new BasicBitfluxClient(
      connectingEventChannel,
      connectedEventChannel,
      disconnectingEventChannel,
      disconnectedEventChannel,
      reconnectingEventChannel,
      invocationEventChannel,
      invocationResultEventChannel,
      connectingEventFactory,
      connectedEventFactory,
      disconnectingEventFactory,
      disconnectedEventFactory,
      reconnectingEventFactory,
      bridge,
      handlerMapper,
      regularInvocationBuilderFactory,
      notifiableInvocationBuilderFactory,
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
