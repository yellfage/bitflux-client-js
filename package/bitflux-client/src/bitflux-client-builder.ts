import { EventEmitter } from '@yellfage/event-emitter'

import type { BitfluxClient } from './bitflux-client'

import type {
  CommunicationSettings,
  CommunicationSettingsBuilder,
  LoggingSettingsBuilder,
  RegularInvocationSettingsBuilder,
  ReconnectionSettingsBuilder,
} from './configuration'

import {
  BasicBitfluxClient,
  BasicBridge,
  BasicCommunicationSettingsBuilder,
  BasicHandlerMapper,
  BasicLoggingSettingsBuilder,
  BasicNotifiableInvocationBuilderFactory,
  BasicReconnectionSettingsBuilder,
  BasicRegularInvocationBuilderFactory,
  BasicRegularInvocationSettingsBuilder,
  MutableState,
  Negotiator,
} from './interior'

export class BitfluxClientBuilder {
  private readonly url: string

  private readonly communicationSettingsBuilder: CommunicationSettingsBuilder

  private readonly reconnectionSettingsBuilder: ReconnectionSettingsBuilder

  private readonly regularInvocationSettingsBuilder: RegularInvocationSettingsBuilder

  private readonly loggingSettingsBuilder: LoggingSettingsBuilder

  public constructor(url: string)
  public constructor(
    url: string,
    communicationSettingsBuilder: CommunicationSettingsBuilder,
    reconnectionSettingsBuilder: ReconnectionSettingsBuilder,
    regularInvocationSettingsBuilder: RegularInvocationSettingsBuilder,
    loggingSettingsBuilder: LoggingSettingsBuilder,
  )
  public constructor(
    url: string,
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
      new Negotiator(
        url,
        communicationSettings.transports,
        communicationSettings.protocols,
      ),
      new EventEmitter(),
      loggingSettings.logger,
      reconnectionSettings.control,
      reconnectionSettings.delayScheme,
    )

    return new BasicBitfluxClient(
      bridge,
      new EventEmitter(),
      new BasicHandlerMapper(bridge, loggingSettings.logger),
      new BasicRegularInvocationBuilderFactory(
        bridge,
        regularInvocationSettings.rejectionDelay,
        regularInvocationSettings.attemptRejectionDelay,
      ),
      new BasicNotifiableInvocationBuilderFactory(bridge),
    )
  }

  public clone(url: string): BitfluxClientBuilder {
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
      throw new Error('Unable to build the client: none Transport is provided')
    }
  }

  private ensureProtocolsProvided(settings: CommunicationSettings): void {
    if (!settings.protocols.length) {
      throw new Error('Unable to build the client: none Protocol is provided')
    }
  }
}
