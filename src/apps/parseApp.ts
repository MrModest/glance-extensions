import type { App } from '../types/apps.js'
import { httpUrl } from './http.js'
import { iconUrl } from './icons.js'

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
    return app
  } catch {
    return null
  }
}
