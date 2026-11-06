import type { App, Wud } from '../types/apps.js'
import { httpUrl } from '../apps/http.js'
import { versionInfo } from '../apps/wud.js'

// Heroicons 2.2.0, 20/solid/question-mark-circle; the label carries the meaning.
function CheckUnavailable() {
  return <span role="img" aria-label="Update check unavailable" title="Update check unavailable"
    style="display: inline-block; width: 1em; height: 1em; vertical-align: -0.15em; margin-left: 0.4em">
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd"
      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
  </span>
}

export default function VersionLine({ tag, wud, app }: { tag?: string; wud?: Wud; app: App }) {
  if (!tag) return null
  const info = versionInfo(tag, wud, app)
  const link = app.releaseUrl || (httpUrl(wud?.result?.link) ? wud.result.link : undefined)
  let badge = <span>→ {info.update}</span>
  if (link) badge = <a class="color-primary" href={link} target="_blank" rel="noreferrer">→ {info.update}</a>
  return <div class="size-h5 color-subdue">
    {tag}{info.unavailable && <CheckUnavailable/>}
    {info.update && <> <span class="color-primary"
      title={`Update available: ${info.update}`}>{badge}</span></>}
  </div>
}
