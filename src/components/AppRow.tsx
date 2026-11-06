import type { App, AppData } from '../types/apps.js'
import { appState } from '../apps/appState.js'
import { iconUrl } from '../apps/icons.js'
import StatusIcon from './StatusIcon.js'
import VersionLine from './VersionLine.js'

export default function AppRow({ app, ...data }: { app: App } & AppData) {
  const { status, tag, wud } = appState(app, data)
  const iconClass = app.icon.startsWith('mdi:') ? ' flat-icon' : ''
  return <li class="monitor-site flex items-center gap-15">
    <img class={`monitor-site-icon${iconClass}`} src={iconUrl(app.icon)} alt="" loading="lazy"/>
    <div class="grow min-width-0">
      <a class="size-h3 color-highlight text-truncate block" href={app.url}
        target="_blank" rel="noreferrer">{app.name}</a>
      <VersionLine tag={tag} wud={wud} app={app}/>
    </div>
    <StatusIcon status={status}/>
  </li>
}
