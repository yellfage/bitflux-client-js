import {
  CommunicationSettings,
  ReconnectionSettings,
  RegularInvocationSettings,
  LoggingSettings
} from './configuration'

export class WstClientFactoryOptions {
  public communication: CommunicationSettings
  public reconnection: ReconnectionSettings
  public regularInvocation: RegularInvocationSettings
  public logging: LoggingSettings

  public constructor(
    communication = new CommunicationSettings(),
    reconnection = new ReconnectionSettings(),
    regularInvocation = new RegularInvocationSettings(),
    logging = new LoggingSettings()
  ) {
    this.communication = communication
    this.reconnection = reconnection
    this.regularInvocation = regularInvocation
    this.logging = logging
  }

  public static validate(options: WstClientFactoryOptions): void {
    CommunicationSettings.validate(options.communication)
    ReconnectionSettings.validate(options.reconnection)
    RegularInvocationSettings.validate(options.regularInvocation)
    LoggingSettings.validate(options.logging)
  }
}
