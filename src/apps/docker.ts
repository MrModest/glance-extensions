import type { Docker, Status } from '../types/apps.js'
import { snapshot } from './http.js'

export function imageTag(image: string): string | undefined {
  const ref = image.split('@')[0]
  const colon = ref.lastIndexOf(':')
  return colon > ref.lastIndexOf('/') ? ref.slice(colon + 1) || undefined : undefined
}

export function containerStatus(container: Docker | undefined): Status {
  if (!container || container.State !== 'running') return 'Unavailable'
  const status = container.Status || ''
  if (/\(unhealthy\)/i.test(status)) return 'Unhealthy'
  if (/\(healthy\)/i.test(status)) return 'Healthy'
  if (/\(health:|\(starting\)/i.test(status)) return 'Unavailable'
  return 'Running'
}

export function fetchDocker(): Promise<Docker[] | null> {
  return snapshot<Docker>(process.env.DOCKER_URL, '/containers/json?all=1')
}
