import type { InvocationBuilder } from '../../invocation'

import type { InvocationFactory } from './invocation-factory'

export interface InvocationBuilderFactory {
  create<TResult>(
    invocationFactory: InvocationFactory,
  ): InvocationBuilder<TResult>
}
