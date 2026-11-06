import assert from 'node:assert/strict'
import test from 'node:test'
import { writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { register } from 'tsx/esm/api'
register()
const { appsRouter } = await import('../src/routes/appsRouter.tsx')
const { imageTag } = await import('../src/apps/docker.ts')
const { iconUrl } = await import('../src/apps/icons.ts')

const apps = [
  ...['healthy', 'running', 'unhealthy', 'starting', 'stopped', 'missing', 'update', 'digest', 'noresult', 'untagged'].map(name => ({ name, icon: 'di:forgejo', url: 'https://example.com', container: name })),
  { name: '<script>alert(1)</script>', icon: 'mdi:camera', url: 'https://example.com', check: 'http://check/up' },
  { name: 'down', icon: 'di:thing.png', url: 'https://example.com', check: 'http://check/down' },
  { name: 'timeout', icon: 'https://example.com/icon.png', url: 'https://example.com', check: 'http://check/timeout' },
]
process.env.DOCKER_URL = 'http://docker'
process.env.WUD_URL = 'http://wud'
process.env.WUD_USER = 'admin'
process.env.WUD_PASSWORD = 'pw'

const docker = ['healthy', 'running', 'unhealthy', 'starting', 'stopped', 'update', 'digest', 'noresult', 'untagged'].map(name => ({ Names: [`/${name}`], Image: name === 'untagged' ? 'img@sha256:abc' : 'localhost:5000/img:1.2', State: name === 'stopped' ? 'exited' : 'running', Status: name === 'starting' ? 'Up (health: starting)' : name === 'healthy' ? 'Up (healthy)' : name === 'unhealthy' ? 'Up (unhealthy)' : 'Up' }))
const wud = ['healthy', 'running', 'unhealthy', 'starting', 'stopped', 'update', 'digest', 'untagged'].map(name => ({ name, image: { tag: { value: '1.2' } }, result: { tag: name === 'update' ? '1.3' : '1.2', link: 'https://example.com/releases' }, updateAvailable: ['update', 'digest'].includes(name) }))
let dockerDown = false, wudDown = false
const server = createServer((req, res) => {
  if (req.url === '/check/timeout') return
  if (req.url === '/check/down') { res.writeHead(403).end(); return }
  if (req.url === '/check/up') { res.end('ok'); return }
  if (req.url === '/containers/json?all=1') {
    if (dockerDown) { res.writeHead(503).end('secret'); return }
    res.end(JSON.stringify(docker)); return
  }
  if (wudDown) { res.writeHead(503).end('secret'); return }
  if (req.headers.authorization !== `Basic ${Buffer.from('admin:pw').toString('base64')}`) { res.writeHead(401).end(); return }
  res.end(JSON.stringify(wud))
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
process.env.DOCKER_URL = base
process.env.WUD_URL = base
for (const app of apps) {
  if (app.check) app.check = app.check.replace('http://check', base + '/check')
}
test.after(() => { server.closeAllConnections(); server.close() })
const render = async () => { const response = await appsRouter.request('/?' + new URLSearchParams([...apps.map(app => ['app', JSON.stringify(app)]), ['app', '{bad']])); return [response, await response.text()] }
const row = (html, name) => html.match(/<li class="monitor-site[\s\S]*?<\/li>/g).find(item => item.includes(`>${name}</a>`))

test('image tags and icon URLs', () => {
  assert.equal(imageTag('codeberg.org/forgejo/forgejo:17.0.1-rootless'), '17.0.1-rootless')
  assert.equal(imageTag('localhost:5000/x:1.2'), '1.2')
  assert.equal(imageTag('img@sha256:abc'), undefined)
  assert.equal(imageTag('img'), undefined)
  assert.equal(imageTag('img:1@sha256:abc'), '1')
  assert.equal(iconUrl('di:foo'), 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/foo.svg')
  assert.equal(iconUrl('di:foo.png'), 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/foo.png')
  assert.equal(iconUrl('mdi:camera'), 'https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/camera.svg')
  assert.equal(iconUrl('https://example.com/icon'), 'https://example.com/icon')
  assert.equal(iconUrl('javascript:alert(1)'), '')
})

test('renders statuses, updates, escaping and headers', async () => {
  const [response, html] = await render()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('widget-title'), null)
  assert.match(html, /Invalid app entry/)
  assert.ok(html.indexOf('>healthy</a>') < html.indexOf('>running</a>'))
  assert.equal(response.headers.get('widget-content-type'), 'html')
  assert.equal(response.headers.get('content-type'), 'text/html; charset=UTF-8')
  for (const [name, status] of Object.entries({ healthy: 'Healthy', running: 'Running', unhealthy: 'Unhealthy', starting: 'Unavailable', stopped: 'Unavailable', missing: 'Unavailable', down: 'Down', timeout: 'Down' })) assert.match(row(html, name), new RegExp(`aria-label="${status}"`))
  assert.match(html, /aria-label="Up"/)
  assert.match(row(html, 'update'), /→ 1\.3/)
  assert.match(row(html, 'update'), /href="https:\/\/example.com\/releases"/)
  assert.doesNotMatch(row(html, 'digest'), /→/)
  assert.doesNotMatch(row(html, 'running'), /Check unavailable|→/)
  assert.match(row(html, 'noresult'), /Check unavailable/)
  assert.doesNotMatch(row(html, 'untagged'), /size-h5/)
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.doesNotMatch(html, /<script>/)
  if (process.env.SAMPLE_FRAGMENT) await writeFile(process.env.SAMPLE_FRAGMENT, html)
})

test('source failures are isolated', async () => {
  dockerDown = true; wudDown = true
  const [, html] = await render()
  assert.match(row(html, 'running'), /aria-label="Unknown"/)
  assert.match(row(html, 'down'), /aria-label="Down"/)
  assert.doesNotMatch(html, /secret/)
  if (process.env.SAMPLE_FRAGMENT) await writeFile(process.env.SAMPLE_FRAGMENT, (await (await import('node:fs/promises')).readFile(process.env.SAMPLE_FRAGMENT, 'utf8')) + '\n' + html)
  dockerDown = false
  const [, html2] = await render()
  assert.match(row(html2, 'running'), /1\.2 · Check unavailable/)
  dockerDown = true; wudDown = false
  const [, html3] = await render()
  assert.match(row(html3, 'update'), /→ 1\.3/)
  dockerDown = false
})

test('requires apps and accepts optional title', async () => {
  assert.equal((await appsRouter.request('/')).status, 400)
  const query = new URLSearchParams({ app: JSON.stringify(apps[0]), title: 'Services' })
  assert.equal((await appsRouter.request('/?' + query)).headers.get('widget-title'), 'Services')
})
