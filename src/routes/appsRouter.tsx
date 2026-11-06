import { Hono } from 'hono'
import type { App } from '../types/apps.js'
import { parseApp } from '../apps/parseApp.js'
import { fetchDocker } from '../apps/docker.js'
import { fetchWud } from '../apps/wud.js'
import { runChecks } from '../apps/checks.js'
import AppList from '../components/AppList.js'

export const appsRouter = new Hono().get('/', async c => {
  const raw = c.req.queries('app') || []
  if (!raw.length) return c.text('At least one app is required', 400)
  const entries = raw.map(parseApp)
  const apps = entries.filter((app): app is App => app !== null)
  const [docker, wud, checks] = await Promise.all([fetchDocker(), fetchWud(), runChecks(apps)])
  const title = c.req.query('title')
  if (title !== undefined) c.header('Widget-Title', title)
  c.header('Widget-Content-Type', 'html')
  return c.html(<AppList entries={entries} docker={docker} wud={wud} checks={checks}/>)
})
