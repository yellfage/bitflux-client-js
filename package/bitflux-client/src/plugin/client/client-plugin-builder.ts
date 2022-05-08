import type { ClientPlugin } from './client-plugin'

export interface ClientPluginBuilder {
  build(): ClientPlugin
}
