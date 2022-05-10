import type { RetryControl } from '../retry-control'

import type { RetryControlBuilder } from '../retry-control-builder'

import { BasicRetryControl } from './basic-retry-control'

export class BasicRetryControlBuilder implements RetryControlBuilder {
  public build(): RetryControl {
    return new BasicRetryControl()
  }
}
