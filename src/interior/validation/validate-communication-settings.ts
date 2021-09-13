import type { CommunicationSettings } from '../../configuration'

export function validateCommunicationSettings({
  protocols
}: CommunicationSettings): void {
  if (!Array.isArray(protocols)) {
    throw new TypeError(
      'Invalid communication settings: the "protocols" field must be an array'
    )
  }
}
