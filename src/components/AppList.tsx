import type { App, AppData } from '../types/apps.js'
import AppRow from './AppRow.js'

export default function AppList({ entries, ...data }: { entries: (App | null)[] } & AppData) {
  return <ul class="dynamic-columns list-gap-20 list-with-separator">
    {entries.map(app => {
      if (!app) return <li class="color-subdue">Invalid app entry</li>
      return <AppRow app={app} {...data}/>
    })}
  </ul>
}
