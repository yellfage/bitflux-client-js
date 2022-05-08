import type {
  ClientPlugin,
  ClientPluginBuilder,
} from '@yellfage/bitflux-client'

import { SampleClientPlugin } from './sample-client-plugin'

export class SampleClientPluginBuilder implements ClientPluginBuilder {
  public build(): ClientPlugin {
    return new SampleClientPlugin()
  }
}
