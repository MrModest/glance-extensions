import type { Wud } from '../types/apps.js'
import { snapshot } from './http.js'

export function versionInfo(tag: string, wud: Wud | undefined) {
  if (!wud || wud.error || !wud.result) return { unavailable: true }
  if (typeof wud.result.tag !== 'string') return { unavailable: true }
  if (!wud.updateAvailable || wud.result.tag === tag) return { unavailable: false }
  return { unavailable: false, update: wud.result.tag }
}

// WUD requires authentication; it accepts HTTP Basic with a WUD user.
function wudHeaders(): HeadersInit | undefined {
  const { WUD_USER: user, WUD_PASSWORD: password } = process.env
  if (!user || !password) return undefined
  return { authorization: `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}` }
}

export function fetchWud(): Promise<Wud[] | null> {
  return snapshot<Wud>(process.env.WUD_URL, '/api/containers', wudHeaders())
}
