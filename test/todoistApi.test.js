import assert from 'node:assert/strict'
import test from 'node:test'
import { TodoistApi } from '@doist/todoist-sdk'

test('Todoist filters use the API v1 endpoint', async () => {
  let requestedUrl
  const client = new TodoistApi('test-token', {
    customFetch: async (url) => {
      requestedUrl = url
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {},
        text: async () => JSON.stringify({ results: [], next_cursor: null }),
        json: async () => ({ results: [], next_cursor: null }),
        arrayBuffer: async () => new ArrayBuffer(0),
      }
    },
  })

  await client.getTasksByFilter({ query: 'today', limit: 200 })

  assert.match(requestedUrl, /^https:\/\/api\.todoist\.com\/api\/v1\/tasks\/filter\?/)
})
