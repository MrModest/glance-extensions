import type { Wud } from '../types/apps.js'
import { snapshot } from './http.js'

// Digits become N, so 1.2.3 and 1.10.0 share a shape but 1.2.3 and 1.2.3-45 don't.
const shape = (tag: string) => tag.replace(/\d+/g, 'N')

// WUD sometimes picks a tag from another channel (a dated build, say).
// Trust its pick (after any tagTransform) only if it matches the app's tagPattern or, without one,
// has the same shape as the installed tag.
function plausible(newTag: string, tag: string, tagPattern?: string): boolean {
  if (tagPattern) return new RegExp(tagPattern).test(newTag)
  return shape(newTag) === shape(tag)
}

// Same syntax as WUD's wud.tag.transform: "regex => replacement".
export function transformTag(tag: string, transform?: string): string {
  if (!transform) return tag
  const [pattern, replacement] = transform.split(' => ')
  return tag.replace(new RegExp(pattern), replacement)
}

export function versionInfo(tag: string, wud: Wud | undefined, app: { tagPattern?: string; tagTransform?: string } = {}) {
  if (!wud || wud.error || !wud.result) return { unavailable: true }
  if (typeof wud.result.tag !== 'string') return { unavailable: true }
  const newTag = transformTag(wud.result.tag, app.tagTransform)
  if (!wud.updateAvailable || newTag === tag) return { unavailable: false }
  if (!plausible(newTag, tag, app.tagPattern)) return { unavailable: true }
  return { unavailable: false, update: newTag }
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
