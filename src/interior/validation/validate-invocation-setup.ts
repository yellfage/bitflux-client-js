import type { InvocationSetup } from '../../invocation-setup'

import { isString } from '../is-string'

export function validateInvocationSetup({
  handlerName,
  args
}: InvocationSetup): void {
  if (!isString(handlerName)) {
    throw new TypeError(
      'Invalid invocation setup: the "handlerName" field must be a string'
    )
  }

  if (args != null && !Array.isArray(args)) {
    throw new TypeError(
      'Invalid invocation setup: the "args" field must be an array'
    )
  }
}
