import { createMiddleware } from 'hono/factory';
import { type AppContext } from "../index.js";
import { TodoistApi } from '@doist/todoist-api-typescript';

const FILTER_ENV_PREFIX = 'TODOIST__FILTER__'

export interface TodoistConfig {
  savedFilters: { [name: string]: string }
  client: TodoistApi
}

export type TodoistContext = {
	Variables: {
		todoist: TodoistConfig
	};
};

export const todoistMiddleware = createMiddleware<AppContext & TodoistContext>(
  async (c, next) => {
    try {
      const client = await getClient(process.env.TODOIST__TOKEN)
      const savedFilters = getSavedFilters()

      c.set('todoist', { client, savedFilters })

      await next()
    } catch(e) {
      const err = e as Error
      return c.text(err.message, 400)
    }
  }
)

async function getClient(token?: string): Promise<TodoistApi> {
  if (!token) {
    throw new Error('Please set "TODOIST__TOKEN" env variable in your extension service!')
  }

  const client = new TodoistApi(token)

  try {
    await client.getTasks({ filter: 'today' }) // test token
  } catch(err) {
    throw new Error('Failed to connect to Todoist. Please re-check your token. Error: ' + JSON.stringify(err))
  }

  return client
}

function getSavedFilters(): { [name: string]: string } {
  return Object.keys(process.env)
    .filter(e => e.startsWith(FILTER_ENV_PREFIX))
    .map(k => {
      const name = k.replace(FILTER_ENV_PREFIX, '').toLowerCase()
      const query = process.env[k]!

      return ({
        [name]: query
      })
    }).reduce((acc, curr) => ({ ...acc, ...curr }), {})
}
