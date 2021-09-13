import type { NotifiableInvocationSetup } from '../../notifiable-invocation-setup'

import { validateInvocationSetup } from './validate-invocation-setup'

export function validateNotifiableInvocationSetup(
  setup: NotifiableInvocationSetup
): void {
  validateInvocationSetup(setup)
}
