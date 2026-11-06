import type { App, Wud } from '../types/apps.js'
import { httpUrl } from '../apps/http.js'
import { versionInfo } from '../apps/wud.js'

export default function VersionLine({ tag, wud, app }: { tag?: string; wud?: Wud; app: App }) {
  if (!tag) return null
  const info = versionInfo(tag, wud)
  const link = app.releaseUrl || (httpUrl(wud?.result?.link) ? wud.result.link : undefined)
  let badge = <span>→ {info.update}</span>
  if (link) badge = <a class="color-primary" href={link} target="_blank" rel="noreferrer">→ {info.update}</a>
  return <div class="size-h5 color-subdue">
    {tag}{info.unavailable && ' · Check unavailable'}
    {info.update && <> <span class="color-primary"
      style="border: 1px solid currentColor; border-radius: 4px; padding: 1px 4px"
      title={`Update available: ${info.update}`}>{badge}</span></>}
  </div>
}
