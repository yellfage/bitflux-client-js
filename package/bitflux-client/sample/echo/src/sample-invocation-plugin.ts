import type { InvocationPlugin, Invocation } from '@yellfage/bitflux-client'

export class SampleInvocationPlugin implements InvocationPlugin {
  public initialize(invocation: Invocation): void {
    invocation.invocating.add((event) =>
      console.log('Local invocating event', event),
    )
    invocation.replying.add((event) =>
      console.log('Local replying event', event),
    )
    invocation.retrying.add((event) =>
      console.log('Local retrying event', event),
    )
  }
}
