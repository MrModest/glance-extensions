# Task Completion Checklist

When a coding task is completed, verify/run the following:

1. **Type-check**: `pnpm exec tsc --noEmit` — ensure no TypeScript errors
2. **Format**: `pnpm exec prettier --check .` — ensure code is formatted correctly
3. **Build**: `pnpm build` — ensure the project builds successfully
4. **Dev server**: `pnpm dev` — quick smoke test that the server starts

## Notes
- No test framework is configured, so no test command to run
- No linter (ESLint) is configured
- Import paths must use `.js` extension for NodeNext compatibility
- Use `import type` for type-only imports (`verbatimModuleSyntax`)
