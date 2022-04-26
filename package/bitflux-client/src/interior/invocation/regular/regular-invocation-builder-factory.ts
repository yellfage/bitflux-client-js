import type { RegularInvocationBuilder } from '../../../invocation'

export interface RegularInvocationBuilderFactory {
  create<TResult>(handlerName: string): RegularInvocationBuilder<TResult>
}
