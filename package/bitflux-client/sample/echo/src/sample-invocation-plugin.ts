import type { InvocationPlugin, Invocation } from '@yellfage/bitflux-client'

export class SampleInvocationPlugin implements InvocationPlugin {
  public initialize(invocation: Invocation): void {
    invocation.inquiry.add((event) => console.log('Local inquiry event', event))
    invocation.reply.add((event) => console.log('Local reply event', event))
    invocation.retry.add((event) => console.log('Local retry event', event))
  }
}
