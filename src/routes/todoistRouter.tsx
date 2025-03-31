import { Hono } from "hono";
import _ from 'lodash'
import { type AppContext } from "../index.js";
import { todoistMiddleware } from "../middleware/todoistMiddleware.js";

export const todoistRouter = new Hono<AppContext>()
  .use(todoistMiddleware)
  .get('/', async (c) => {
    const { client, savedFilters } = c.var.todoist
    const filter = (c.req.query('filter') || 'today').toLowerCase()
    // check property names here: https://developer.todoist.com/rest/v2/?javascript#get-active-tasks
    const sortBy = (c.req.query('sortBy') || 'order').split(',')
    const widgetTitle = c.req.query('title') || 'Todoist'

    // check if it's a name of one of the saved filter,
    // otherwise, use directly as a custom query
    const filterQuery = savedFilters[filter] || filter

    c.header('Widget-Title', widgetTitle);
		c.header('Widget-Content-Type', 'html');

    try {
      const tasks = await client.getTasks( { filter: filterQuery })
      const sortedTasks = _.orderBy(tasks, sortBy)

      return c.json(sortedTasks)
    } catch (err) {
      return c.text(`Can not fetch tasks by the query '${filterQuery}': ${JSON.stringify(err)}`)
    }
  })
  .post('/', async (c) => {
    const { client } = c.var.todoist
    const form = await c.req.formData();
    const taskId = form.get('taskId')?.toString();
		const returnTo = c.req.header('referer');

		if (!taskId) {
			return c.text('No Todoist task ID specified', 400);
		}

		await client.closeTask(taskId);

		if (returnTo) {
			return c.redirect(returnTo);
		}

		return c.text(`Task ${taskId} marked as completed!`, 200);
  })
