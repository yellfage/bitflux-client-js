import type { ReconnectionScheme } from '../reconnection'

import { DefaultReconnectionScheme } from '../reconnection'

import { ReconnectionSettings } from './reconnection-settings'

export class ReconnectionSettingsBuilder {
  private scheme: ReconnectionScheme = new DefaultReconnectionScheme()

  public setScheme(scheme: ReconnectionScheme): this {
    this.scheme = scheme

    return this
  }

  public build(): ReconnectionSettings {
    return new ReconnectionSettings(this.scheme)
  }
}
