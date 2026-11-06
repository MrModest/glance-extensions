import type { App } from '../types/apps.js'
import { httpUrl } from './http.js'
import { iconUrl } from './icons.js'

function validRegex(value: unknown): boolean {
  if (typeof value !== 'string' || !value) return false
  try {
    new RegExp(value)
    return true
  } catch {
    return false
  }
}

function validTransform(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const parts = value.split(' => ')
  return parts.length === 2 && validRegex(parts[0])
}

export function parseApp(raw: string): App | null {
  try {
    const app = JSON.parse(raw)
    if (!app || typeof app !== 'object') return null
    if (typeof app.name !== 'string' || !app.name.trim()) return null
    if (typeof app.icon !== 'string' || !iconUrl(app.icon)) return null
    if (!httpUrl(app.url)) return null
    if (app.releaseUrl !== undefined && !httpUrl(app.releaseUrl)) return null
    if ((app.container !== undefined) === (app.check !== undefined)) return null
    if (app.container !== undefined) {
      if (typeof app.container !== 'string' || !app.container.trim()) return null
    }
    if (app.check !== undefined && !httpUrl(app.check)) return null
    if (app.tagPattern !== undefined && !validRegex(app.tagPattern)) return null
    if (app.tagTransform !== undefined && !validTransform(app.tagTransform)) return null
    return app
  } catch {
    return null
  }
}
