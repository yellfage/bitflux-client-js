import type { Plugin } from './plugin'

export interface PluginBuilder {
  build(): Plugin
}
