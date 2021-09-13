import type { WstClientFactoryOptions } from '../../wst-client-factory-options'

import { validateCommunicationSettings } from './validate-communication-settings'

import { validateLoggingSettings } from './validate-logging-settings'

import { validateReconnectionSettings } from './validate-reconnection-settings'

import { validateRegularInvocationSettings } from './validate-regular-invocation-settings'

export function validateWstClientFactoryOptions(
  options: WstClientFactoryOptions
): void {
  validateCommunicationSettings(options.communication)
  validateReconnectionSettings(options.reconnection)
  validateRegularInvocationSettings(options.regularInvocation)
  validateLoggingSettings(options.logging)
}
