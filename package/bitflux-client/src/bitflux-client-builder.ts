import { BasicEventChannel } from '@yellfage/events'

import type { BitfluxClient } from './bitflux-client'

import type {
  CommunicationSettings,
  CommunicationSettingsBuilder,
  InvocationSettingsBuilder,
  LoggingSettingsBuilder,
  ReconnectionSettingsBuilder,
} from './configuration'

import type {
  ConnectedEventHandler,
  ConnectingEventHandler,
  DisconnectedEventHandler,
  DisconnectingEventHandler,
  InvocatingEventHandler,
  ReconnectingEventHandler,
  ReplyingEventHandler,
  RetryingEventHandler,
} from './event'

import type {
  ConnectedBridgeEventHandler,
  ConnectingBridgeEventHandler,
  DisconnectedBridgeEventHandler,
  DisconnectingBridgeEventHandler,
  MessageBridgeEventHandler,
  ReconnectingBridgeEventHandler,
} from './interior'

import {
  BasicInvocatingEventFactory,
  BasicReplyingEventFactory,
  BasicRetryingEventFactory,
  BasicInvocationBuilderFactory,
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
  BasicLoggingSettingsBuilder,
  BasicMessageBridgeEventFactory,
  BasicReconnectingBridgeEventFactory,
  BasicReconnectingEventFactory,
  BasicReconnectionSettingsBuilder,
  MutableState,
} from './interior'

import { BasicInvocationSettingsBuilder } from './interior/configuration/invocation'

import type { ClientPluginBuilder } from './plugin'

export class BitfluxClientBuilder {
  private readonly url: string | URL

  private readonly communicationSettingsBuilder: CommunicationSettingsBuilder

  private readonly reconnectionSettingsBuilder: ReconnectionSettingsBuilder

  private readonly invocationSettingsBuilder: InvocationSettingsBuilder

  private readonly loggingSettingsBuilder: LoggingSettingsBuilder

  private readonly pluginBuilders: ClientPluginBuilder[]

  public constructor(url: string | URL)
  public constructor(
    url: string | URL,
    communicationSettingsBuilder: CommunicationSettingsBuilder,
    reconnectionSettingsBuilder: ReconnectionSettingsBuilder,
    invocationSettingsBuilder: InvocationSettingsBuilder,
    loggingSettingsBuilder: LoggingSettingsBuilder,
    pluginBuilders: ClientPluginBuilder[],
  )
  public constructor(
    url: string | URL,
    communicationSettingsBuilder: CommunicationSettingsBuilder = new BasicCommunicationSettingsBuilder(),
    reconnectionSettingsBuilder: ReconnectionSettingsBuilder = new BasicReconnectionSettingsBuilder(),
    invocationSettingsBuilder: InvocationSettingsBuilder = new BasicInvocationSettingsBuilder(),
    loggingSettingsBuilder: LoggingSettingsBuilder = new BasicLoggingSettingsBuilder(),
    pluginBuilders: ClientPluginBuilder[] = [],
  ) {
    this.url = url
    this.communicationSettingsBuilder = communicationSettingsBuilder
    this.reconnectionSettingsBuilder = reconnectionSettingsBuilder
    this.invocationSettingsBuilder = invocationSettingsBuilder
    this.loggingSettingsBuilder = loggingSettingsBuilder
    this.pluginBuilders = pluginBuilders
  }

  public use(builder: ClientPluginBuilder): this {
    this.pluginBuilders.push(builder)

    return this
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

  public configureInvocation(
    configure: (builder: InvocationSettingsBuilder) => void,
  ): this {
    configure(this.invocationSettingsBuilder)

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

    const invocationSettings = this.invocationSettingsBuilder.build()

    const loggingSettings = this.loggingSettingsBuilder.build()

    this.ensureTransportsProvided(communicationSettings)
    this.ensureProtocolsProvided(communicationSettings)

    const url = new URL(this.url)

    const state = new MutableState()

    const connectingBridgeEventChannel =
      new BasicEventChannel<ConnectingBridgeEventHandler>()

    const connectedBridgeEventChannel =
      new BasicEventChannel<ConnectedBridgeEventHandler>()

    const disconnectingBridgeEventChannel =
      new BasicEventChannel<DisconnectingBridgeEventHandler>()

    const disconnectedBridgeEventChannel =
      new BasicEventChannel<DisconnectedBridgeEventHandler>()

    const reconnectingBridgeEventChannel =
      new BasicEventChannel<ReconnectingBridgeEventHandler>()

    const messageBridgeEventChannel =
      new BasicEventChannel<MessageBridgeEventHandler>()

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

    const connectingEventChannel =
      new BasicEventChannel<ConnectingEventHandler>()

    const connectedEventChannel = new BasicEventChannel<ConnectedEventHandler>()

    const disconnectingEventChannel =
      new BasicEventChannel<DisconnectingEventHandler>()

    const disconnectedEventChannel =
      new BasicEventChannel<DisconnectedEventHandler>()

    const reconnectingEventChannel =
      new BasicEventChannel<ReconnectingEventHandler>()

    const invocatingEventChannel =
      new BasicEventChannel<InvocatingEventHandler>()

    const replyingEventChannel = new BasicEventChannel<ReplyingEventHandler>()

    const retryingEventChannel = new BasicEventChannel<RetryingEventHandler>()

    const connectingEventFactory = new BasicConnectingEventFactory()

    const connectedEventFactory = new BasicConnectedEventFactory()

    const disconnectingEventFactory = new BasicDisconnectingEventFactory()

    const disconnectedEventFactory = new BasicDisconnectedEventFactory()

    const reconnectingEventFactory = new BasicReconnectingEventFactory()

    const invocatingEventFactory = new BasicInvocatingEventFactory()

    const replyingEventFactory = new BasicReplyingEventFactory()

    const retryingEventFactory = new BasicRetryingEventFactory()

    const handlerMapper = new BasicHandlerMapper(bridge, loggingSettings.logger)

    const invocationBuilderFactory = new BasicInvocationBuilderFactory(
      invocatingEventChannel,
      replyingEventChannel,
      retryingEventChannel,
      invocatingEventFactory,
      replyingEventFactory,
      retryingEventFactory,
      bridge,
      invocationSettings.rejectionDelay,
      invocationSettings.attemptRejectionDelay,
      invocationSettings.retryControl,
      invocationSettings.retryDelayScheme,
    )

    const client = new BasicBitfluxClient(
      connectingEventChannel,
      connectedEventChannel,
      disconnectingEventChannel,
      disconnectedEventChannel,
      reconnectingEventChannel,
      invocatingEventChannel,
      replyingEventChannel,
      retryingEventChannel,
      connectingEventFactory,
      connectedEventFactory,
      disconnectingEventFactory,
      disconnectedEventFactory,
      reconnectingEventFactory,
      bridge,
      handlerMapper,
      invocationBuilderFactory,
    )

    this.pluginBuilders.forEach((builder) => client.use(builder))

    return client
  }

  public clone(url: string | URL): BitfluxClientBuilder {
    return new BitfluxClientBuilder(
      new URL(url),
      this.communicationSettingsBuilder.clone(),
      this.reconnectionSettingsBuilder.clone(),
      this.invocationSettingsBuilder.clone(),
      this.loggingSettingsBuilder.clone(),
      this.pluginBuilders.slice(),
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
