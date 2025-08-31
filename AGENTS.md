# Repository Guidelines

## Project Structure & Modules
- `src/app`: Next.js App Router pages, layouts, and API routes.
- `src/components`: Reusable React components (PascalCase files and folders).
- `src/lib`: Shared utilities (API clients, helpers) for server/client.
- `src/services`: Domain/service layer for data access and side effects.
- `src/hooks`: Custom React hooks (prefix with `use...`).
- `src/types`: TypeScript types and interfaces.
- `src/styles`: Global and module styles (Tailwind-first).
- `src/emails`: React Email templates rendered via `resend`.
- `public`: Static assets.
- `middleware.ts`: Next.js middleware (auth, rewrites, headers).

## Build, Test, and Development
- `npm run dev`: Start local dev server.
- `npm run build`: Production build (`.next/`).
- `npm run start`: Run the production build.
- `npm run lint`: ESLint checks with Next config.
- `npm run format`: Prettier formats the repo.

## Coding Style & Naming
- Language: TypeScript + React 18, Next.js 14 App Router, Tailwind CSS.
- Formatting: Prettier (run `npm run format`) — no manual style nits.
- Linting: ESLint (`npm run lint`) with `eslint-config-next` and Prettier.
- Indentation: 2 spaces; avoid semicolons if Prettier omits them.
- Components: PascalCase (`BookingCard.tsx`), one default export.
- Hooks: camelCase with `use` prefix (`useBookingForm.ts`).
- Files in `src/lib`/`src/services`: group by domain (`reservations/`), avoid long files.

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest/Jest for unit tests under `src/__tests__/` and Playwright for E2E under `e2e/`.
- Aim for critical-path coverage (auth, booking flow, payments) and test pure logic in `src/lib` first.

## Commit & PR Guidelines
- Commits: concise, imperative subject (≤72 chars). Example: `feat(reservations): add cancel policy enforcement`.
- PRs: include purpose, screenshots for UI, reproduction steps, and linked issues/Linear tickets. Keep scope focused; note any follow‑ups.

## Security & Configuration
- Env vars: copy `.env.example` → `.env`; never commit secrets. Relevant keys: Supabase, Resend, app URLs.
- Do not expose server-only keys to the client; keep server code in `src/app/**/route.ts` or server utilities.
- Review `next.config.js`, `tailwind.config.ts`, and `middleware.ts` when changing build or routing behavior.
