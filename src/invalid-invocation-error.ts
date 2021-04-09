import { InvalidOperationError } from './invalid-operation-error'

export class InvalidInvocationError extends InvalidOperationError {
  public constructor(message?: string) {
    super(message)

    super.name = 'InvalidInvocationError'
  }
}
