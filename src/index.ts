import 'dotenv/config';
import { serve, type HttpBindings } from '@hono/node-server'
import { Hono } from 'hono'
import { todoistRouter } from './routes/todoistRouter.js';

export type AppContext = {
	Bindings: HttpBindings;
};

const app = new Hono<AppContext>()

app.route('/todoist', todoistRouter)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: process.env.APP__PORT || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
