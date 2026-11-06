import type { App } from '../types/apps.js'
import { get } from './http.js'

export async function runChecks(apps: App[]): Promise<Map<App, boolean>> {
  const checks = apps.filter(app => app.check)
  const results = new Map<App, boolean>()
  let index = 0
  await Promise.all(Array.from({ length: Math.min(5, checks.length) }, async () => {
    while (index < checks.length) {
      const app = checks[index++]
      try {
        await get(app.check!)
        results.set(app, true)
      } catch {
        results.set(app, false)
      }
    }
  }))
  return results
}
