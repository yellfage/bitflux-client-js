import {
  CommunicationSettings,
  LoggingSettings,
  ReconnectionSettings,
  InvocationSettings
} from './settings'

export type ClientOptions = {
  logging?: Partial<LoggingSettings>
  reconnection?: Partial<ReconnectionSettings>
  communication?: Partial<CommunicationSettings>
  invocation?: Partial<InvocationSettings>
}
