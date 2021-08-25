import { InvocationSetup } from '../../invocation-setup'
import { StringUtils } from '../string-utils'

export class InvocationSetupValidator {
  public static validate({ handlerName, args }: InvocationSetup): void {
    if (!StringUtils.isString(handlerName)) {
      throw new TypeError(
        'Invalid invocation setup: the "handlerName" field must be a string'
      )
    }

    if (args !== undefined && !Array.isArray(args)) {
      throw new TypeError(
        'Invalid invocation setup: the "args" field must be an array'
      )
    }
  }
}
