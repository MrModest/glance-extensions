import type { Wud } from '../types/apps.js'
import { snapshot } from './http.js'

export function versionInfo(tag: string, wud: Wud | undefined) {
  if (!wud || wud.error || !wud.result) return { unavailable: true }
  if (typeof wud.result.tag !== 'string') return { unavailable: true }
  if (!wud.updateAvailable || wud.result.tag === tag) return { unavailable: false }
  return { unavailable: false, update: wud.result.tag }
}

export function fetchWud(): Promise<Wud[] | null> {
  return snapshot<Wud>(process.env.WUD_URL, '/api/containers')
}
