import type { ClientPlugin, BitfluxClient } from '@yellfage/bitflux-client'

export class SampleClientPlugin implements ClientPlugin {
  public initialize(client: BitfluxClient): void {
    client.invocating.add((event) =>
      console.log('Global invocating event', event),
    )
    client.replying.add((event) => console.log('Global replying event', event))
    client.retrying.add((event) => console.log('Global retrying event', event))
  }
}
