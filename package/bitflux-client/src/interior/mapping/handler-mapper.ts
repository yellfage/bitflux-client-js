import type { InvocationHandler } from '../../invocation'

export interface HandlerMapper {
  map(handlerName: string, handler: InvocationHandler): void
}
