# Suggested Commands

## Development
```bash
pnpm dev          # Start dev server with hot reload (tsx watch)
pnpm build        # Compile TypeScript to dist/
pnpm start        # Run compiled app from dist/
```

## Package Management
```bash
pnpm install      # Install dependencies
pnpm add <pkg>    # Add a dependency
pnpm add -D <pkg> # Add a dev dependency
```

## Docker
```bash
docker build -t glance-extensions .     # Build Docker image
docker run -p 3000:3000 glance-extensions  # Run container
```

## Testing
No test framework is currently configured.

## Linting / Formatting
No dedicated linter (e.g. ESLint) is configured.
Prettier is available with config in `.prettierrc`:
```bash
pnpm exec prettier --write .    # Format all files
pnpm exec prettier --check .    # Check formatting
```

## TypeScript
```bash
pnpm exec tsc --noEmit   # Type-check without emitting
```

## System Utils (Darwin/macOS)
```bash
git, ls, cd, grep, find, cat, sed, awk  # Standard Unix tools available
```
