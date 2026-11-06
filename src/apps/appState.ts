import type { App, AppData, Status, Wud } from '../types/apps.js'
import { containerStatus, imageTag } from './docker.js'

export type AppState = { status: Status; tag?: string; wud?: Wud }

export function appState(app: App, { docker, wud, checks }: AppData): AppState {
  if (app.check) return { status: checks.get(app) ? 'Up' : 'Down' }

  const matches = wud?.filter(item => item?.name === app.container) || []
  const version = matches.length === 1 ? matches[0] : undefined

  // Proxy down: status is unknown, but WUD still knows the installed tag.
  if (docker === null) return { status: 'Unknown', tag: version?.image?.tag?.value, wud: version }

  const container = docker.find(item => item?.Names?.includes(`/${app.container}`))
  const tag = container ? imageTag(container.Image || '') : undefined
  return { status: containerStatus(container), tag, wud: version }
}
