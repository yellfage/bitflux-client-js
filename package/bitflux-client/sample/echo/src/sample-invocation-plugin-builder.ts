import type {
  InvocationPlugin,
  InvocationPluginBuilder,
} from '@yellfage/bitflux-client'

import { SampleInvocationPlugin } from './sample-invocation-plugin'

export class SampleInvocationPluginBuilder implements InvocationPluginBuilder {
  public build(): InvocationPlugin {
    return new SampleInvocationPlugin()
  }
}
