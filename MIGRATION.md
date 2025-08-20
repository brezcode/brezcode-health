# Migration guide from `brezcode-platform` to `brezcode-health`

Use this loop for each component/feature you port:

1. Copy the component and its immediate dependencies (styles/assets/utils) into `src/...`.
2. Update imports to use aliases:
   - `@/*`, `@components/*`, `@features/*`, `@hooks/*`, `@lib/*`, `@styles/*`, `@assets/*`.
3. Convert to ESM if needed (`import`/`export`).
4. Replace `process.env.*` with `import.meta.env.*`.
5. Add a temporary usage in `App.tsx` (or a route) to smoke-test.
6. Fix types and lints; aim for strict types.
7. Commit.

Notes
- Vite config changes require restarting the dev server.
- Keep shared helpers in `src/lib`.
- Prefer CSS Modules or a single styling approach consistently.


