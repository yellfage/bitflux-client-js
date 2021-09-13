import type { ReconnectionSettings } from '../../configuration'

export function validateReconnectionSettings({
  policy
}: ReconnectionSettings): void {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (policy == null) {
    throw new TypeError(
      'Invalid reconnection settings: the "policy" field cannot be a null or undefined'
    )
  }
}
