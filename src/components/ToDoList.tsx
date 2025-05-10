import { css, Style } from "hono/css";

interface ToDoItemProps {
  id: string;
  name: string;
  url: string;
  labels: string[];
  project?: string;
}

const ToDoItem = ({id, name, url, labels, project}: ToDoItemProps) => (
  <li class={todolist_item}>
    <span class={todolist_item_bullet}>⋅</span>
    <div class={todolist_item_container}>
      <a class={todolist_item_title} href={url} target="_blank">{name}</a>
      <div class={todolist_item_subtitle}>
        <span>{project}</span>
      </div>
      <div class={todolist_item_subtitle}>
        {labels.map(label => (
          <span key={label}>
            {label}
          </span>
        ))}
      </div>
    </div>
  </li>
)

const ToDoList = (props: { items: ToDoItemProps[] }) => (
  <>
    <Style />
    <ul class={todolist}>
      {props.items.map(i => (
        <ToDoItem key={i.id} {...i} />
      ))}
    </ul>
  </>
)

export default ToDoList

const todolist = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
