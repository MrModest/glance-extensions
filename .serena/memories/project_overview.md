# Glance Extensions

## Purpose
A server providing custom widget extensions for the [Glance](https://github.com/glanceapp/glance) Dashboard.
Currently implements a Todoist integration that displays tasks in Glance widgets.
Deployed as a Docker container alongside the main Glance container.

## Tech Stack
- **Runtime**: Node.js (v24 in Docker)
- **Language**: TypeScript (strict mode, ESNext target, NodeNext modules)
- **Framework**: [Hono](https://hono.dev/) - lightweight web framework
- **JSX**: Hono JSX (`react-jsx` with `hono/jsx` import source) for server-side rendering
- **CSS**: `hono/css` (CSS-in-JS via `css` tagged template literals)
- **Package Manager**: pnpm (v10.30.3 via corepack)
- **Module System**: ESM (`"type": "module"`)
- **APIs**: Todoist API via `@doist/todoist-api-typescript`
- **Other deps**: lodash, dotenv, hono-tailwind

## Project Structure
```
src/
├── index.tsx              # Entry point - Hono app setup, JSX renderer, routes
├── routes/
│   └── todoistRouter.tsx  # Todoist route handler (GET /)
├── middleware/
│   └── todoistMiddleware.tsx  # Todoist API client & filter config middleware
├── components/
│   └── ToDoList.tsx       # JSX components for rendering todo items
├── types/
│   └── environment.d.ts   # Environment variable type declarations
└── ui/
    ├── components/        # (empty - future UI components)
    └── views/             # (empty - future views)
```

## Configuration
- Environment variables prefixed with `APP__`, `TODOIST__`
- `APP__PORT` - server port (default 3000)
- `TODOIST__TOKEN` - Todoist API token
- `TODOIST__FILTER__*` - custom Todoist query filters (e.g. `TODOIST__FILTER__WORK`)
- Config loaded via `dotenv/config`

## CI/CD
- GitHub Actions workflow for Docker image publishing (`.github/workflows/docker-publish.yml`)
- Docker image published to `ghcr.io/mrmodest/glance-extensions`
