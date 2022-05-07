import { BasicRetryControl } from './basic-retry-control'

import type { RetryControl } from './retry-control'

import type { RetryControlBuilder } from './retry-control-builder'

export class BasicRetryControlBuilder implements RetryControlBuilder {
  public build(): RetryControl {
    return new BasicRetryControl()
  }

  public clone(): RetryControlBuilder {
    return new BasicRetryControlBuilder()
  }
}
