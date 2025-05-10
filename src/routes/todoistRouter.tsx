import { Hono } from "hono";
import _ from 'lodash'
import { type AppContext } from "../index.js";
import { todoistMiddleware } from "../middleware/todoistMiddleware.js";
import ToDoList from "../components/ToDoList.js";

export const todoistRouter = new Hono<AppContext>()
  .use(todoistMiddleware)
  .get('/', async (c) => {
    const { client, savedFilters } = c.var.todoist
    const filter = (c.req.query('filter') || 'today').toLowerCase()
    // check property names here: https://developer.todoist.com/rest/v2/?javascript#get-active-tasks
    const sortBy = (c.req.query('sortBy') || 'order').split(',')
    const widgetTitle = c.req.query('title') || 'Todoist'
    const widgetTitleUrl = c.req.query('titleUrl') || 'https://app.todoist.com/app/today'

    // check if it's a name of one of the saved filter,
    // otherwise, use directly as a custom query
    const filterQuery = savedFilters[filter] || filter

    c.header('Widget-Title', widgetTitle);
		c.header('Widget-Title-URL', widgetTitleUrl);
		c.header('Widget-Content-Type', 'html');

    try {
      const tasks = await client.getTasks( { filter: filterQuery })
      const sortedTasks = _.orderBy(tasks, sortBy)

      const projectIds = _.uniq(sortedTasks.map(t => t.projectId))

      const projects = await Promise.all(
        projectIds.map(id => client.getProject(id))
      )

      const projectsMap = _.keyBy(projects, 'id')

      return c.render(
        <ToDoList
          items={sortedTasks.map(t => ({
            id: t.id,
            name: t.content,
            url: t.url,
            labels: t.labels,
            project: projectsMap[t.projectId]?.name,
          }))}
        />
      )
    } catch (err) {
      return c.text(`Can not fetch tasks by the query '${filterQuery}': ${JSON.stringify(err)}`)
    }
  })
