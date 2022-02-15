import type {
  ReconnectionControl,
  ReconnectionDelayScheme,
} from '../reconnection'

export interface ReconnectionSettings {
  readonly control: ReconnectionControl
  readonly delayScheme: ReconnectionDelayScheme
}
