import type { ClientPlugin, BitfluxClient } from '@yellfage/bitflux-client'

export class SampleClientPlugin implements ClientPlugin {
  public initialize(client: BitfluxClient): void {
    client.inquiry.add((event) => console.log('Global inquiry event', event))
    client.reply.add((event) => console.log('Global reply event', event))
    client.retry.add((event) => console.log('Global retry event', event))
  }
}
