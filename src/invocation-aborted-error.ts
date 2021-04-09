import { OperationAbortedError } from './operation-aborted-error'

export class InvocationAbortedError extends OperationAbortedError {
  public constructor(message?: string) {
    super(message)

    super.name = 'InvocationAbortedError'
  }
}
