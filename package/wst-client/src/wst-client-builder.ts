import { EventEmitter } from '@yellfage/event-emitter'

import type { CommunicationSettings } from './configuration'

import {
  CommunicationSettingsBuilder,
  LoggingSettingsBuilder,
  RegularInvocationSettingsBuilder
} from './configuration'

import { ReconnectionSettingsBuilder } from './configuration/reconnection-settings-builder'

import {
  BasicBridge,
  BasicHandlerMapper,
  BasicNotifiableInvocationBuilderFactory,
  BasicRegularInvocationBuilderFactory,
  BasicWstClient,
  MutableState,
  Negotiator
} from './interior'

import type { WstClient } from './wst-client'

export class WstClientBuilder {
  private readonly communicationSettingsBuilder =
    new CommunicationSettingsBuilder()

  private readonly reconnectionSettingsBuilder =
    new ReconnectionSettingsBuilder()

  private readonly regularInvocationSettingsBuilder =
    new RegularInvocationSettingsBuilder()

  private readonly loggingSettingsBuilder = new LoggingSettingsBuilder()

  private readonly url: string

  public constructor(url: string) {
    this.url = url
  }

  public configureCommunication(
    configure: (builder: CommunicationSettingsBuilder) => void
  ): this {
    configure(this.communicationSettingsBuilder)

    return this
  }

  public configureReconnection(
    configure: (builder: ReconnectionSettingsBuilder) => void
  ): this {
    configure(this.reconnectionSettingsBuilder)

    return this
  }

  public configureRegularInvocation(
    configure: (builder: RegularInvocationSettingsBuilder) => void
  ): this {
    configure(this.regularInvocationSettingsBuilder)

    return this
  }

  public configureLogging(
    configure: (builder: LoggingSettingsBuilder) => void
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

    this.ensureTransportsProvided(communicationSettings)
    this.ensureProtocolsProvided(communicationSettings)

    const url = new URL(this.url)

    const bridge = new BasicBridge(
      url,
      new MutableState(),
      new Negotiator(
        url,
        communicationSettings.transports,
        communicationSettings.protocols
      ),
      new EventEmitter(),
      loggingSettings.logger,
      reconnectionSettings.scheme
    )

    return new BasicWstClient(
      bridge,
      new EventEmitter(),
      new BasicHandlerMapper(bridge, loggingSettings.logger),
      new BasicRegularInvocationBuilderFactory(
        bridge,
        regularInvocationSettings.rejectionDelay,
        regularInvocationSettings.attemptRejectionDelay
      ),
      new BasicNotifiableInvocationBuilderFactory(bridge)
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
