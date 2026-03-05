# Code Style and Conventions

## Formatting (Prettier)
- **Indent**: 2 spaces (no tabs)
- **Quotes**: Single quotes
- **Semicolons**: None (no trailing semicolons)
- **Line endings**: LF
- **Trailing whitespace**: Trimmed
- **Final newline**: Yes

## TypeScript
- Strict mode enabled
- ESNext target with NodeNext module resolution
- `verbatimModuleSyntax: true` - must use `import type` for type-only imports
- File extensions: `.tsx` for files with JSX, `.ts` for pure TypeScript
- Import paths use `.js` extension (NodeNext module resolution requires it)

## JSX
- Uses Hono JSX (`jsxImportSource: "hono/jsx"`)
- Server-side rendered HTML widgets
- CSS-in-JS via `hono/css` `css` tagged template literals
- Components are functional (arrow functions exported as `const`)

## Naming
- Files: camelCase (e.g. `todoistRouter.tsx`, `todoistMiddleware.tsx`)
- Components: PascalCase (e.g. `ToDoList`, `ToDoItem`)
- Constants: camelCase or UPPER_SNAKE_CASE for env-related constants
- Interfaces: PascalCase (e.g. `TodoistConfig`, `ToDoItemProps`)
- Type exports: `export type` syntax

## Architecture Patterns
- Hono router pattern: separate routers per feature in `src/routes/`
- Middleware pattern: Hono middleware in `src/middleware/` for setting up context (e.g. API clients)
- Components in `src/components/` for reusable JSX
- Environment types declared in `src/types/environment.d.ts`
- Context typing via Hono generics (`Hono<AppContext>`)
