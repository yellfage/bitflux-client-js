import type { ReconnectionScheme } from '../reconnection'

export class ReconnectionSettings {
  public readonly scheme: ReconnectionScheme

  public constructor(scheme: ReconnectionScheme) {
    this.scheme = scheme
  }
}
