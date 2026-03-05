import { css, Style } from "hono/css";

interface ToDoItemProps {
  id: string;
  name: string;
  url: string;
  labels: string[];
}

interface ToDoGroupProps {
  projectName: string;
  items: ToDoItemProps[];
}

const ToDoItem = ({id, name, url, labels}: ToDoItemProps) => (
  <li class={todolist_item}>
    <span class={todolist_item_bullet}>⋅</span>
    <div class={todolist_item_container}>
      <a class={todolist_item_title} href={url} target="_blank">{name}</a>
      {labels.length > 0 && (
        <div class={todolist_item_subtitle}>
          {labels.map(label => (
            <span key={label}>
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  </li>
)

const ToDoGroup = ({projectName, items}: ToDoGroupProps) => (
  <div class={todolist_group}>
    <h4 class={todolist_group_header}>{projectName}</h4>
    <ul class={todolist_group_items}>
      {items.map(i => (
        <ToDoItem key={i.id} {...i} />
      ))}
    </ul>
  </div>
)

const ToDoList = (props: { groups: ToDoGroupProps[] }) => (
  <>
    <Style />
    <div class={todolist_container}>
      {props.groups.map(g => (
        <ToDoGroup key={g.projectName} {...g} />
      ))}
    </div>
  </>
)

export default ToDoList
export type { ToDoGroupProps, ToDoItemProps }

const todolist_container = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const todolist_group = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const todolist_group_header = css`
  font-size: var(--font-size-h4);
  color: var(--color-primary);
  font-weight: bold;
  margin: 0;
`

const todolist_group_items = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const todolist_item = css`
  display: flex;
  flex-direction: row;
`

const todolist_item_bullet = css`
  font-size: var(--font-size-h3);
  font-weight: bold;
  color: var(--color-primary);
  margin-right: 0.5rem;
`

const todolist_item_container = css`
  display: flex;
  flex-direction: column;
`

const todolist_item_title = css`
  font-size: var(--font-size-h3);
  color: var(--color-primary);
`

const todolist_item_subtitle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: var(--font-size-h6);
  color: var(--color-secondary);
`
