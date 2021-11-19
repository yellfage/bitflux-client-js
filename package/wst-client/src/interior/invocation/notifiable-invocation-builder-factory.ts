import type { NotifiableInvocationBuilder } from '../../invocation'

export interface NotifiableInvocationBuilderFactory {
  create(handlerName: string): NotifiableInvocationBuilder
}
