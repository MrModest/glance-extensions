import 'dotenv/config';
import { serve, type HttpBindings } from '@hono/node-server'
import { Hono } from 'hono'
import { todoistRouter } from './routes/todoistRouter.js';
import { jsxRenderer } from 'hono/jsx-renderer';
import { Style } from 'hono/css';
import PreviewPage from './components/PreviewPage.js';

export type AppContext = {
  Bindings: HttpBindings;
};

const app = new Hono<AppContext>()

app.use(
  jsxRenderer(({ children }) => {
    return (
      <html>
        <head>
          <title>Glance Widgets</title>
          <Style />
        </head>
        <body>
          <div>{children}</div>
        </body>
      </html>
    )
  })
)

app.route('/todoist', todoistRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/preview/todoist', async (c) => {
  const query = new URL(c.req.url).search
  const res = await app.request(`/todoist${query}`)
  const widgetHtml = await res.text()

  return c.render(<PreviewPage title="Todoist" widgetHtml={widgetHtml} />)
})

serve({
  fetch: app.fetch,
  port: process.env.APP__PORT || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
