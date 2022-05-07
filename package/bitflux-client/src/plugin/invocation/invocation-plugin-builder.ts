import type { InvocationPlugin } from './invocation-plugin'

export interface InvocationPluginBuilder {
  build(): InvocationPlugin
}
