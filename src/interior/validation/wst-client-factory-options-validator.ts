import { WstClientFactoryOptions } from '../../wst-client-factory-options'
import { CommunicationSettingsValidator } from './communication-settings-validator'
import { ReconnectionSettingsValidator } from './reconnection-settings-validator'
import { RegularInvocationSettingsValidator } from './regular-invocation-settings-validator'
import { LoggingSettingsValidator } from './logging-settings-validator'

export class WstClientFactoryOptionsValidator {
  public static validate(options: WstClientFactoryOptions): void {
    CommunicationSettingsValidator.validate(options.communication)
    ReconnectionSettingsValidator.validate(options.reconnection)
    RegularInvocationSettingsValidator.validate(options.regularInvocation)
    LoggingSettingsValidator.validate(options.logging)
  }
}
