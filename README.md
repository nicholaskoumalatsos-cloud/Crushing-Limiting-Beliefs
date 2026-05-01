# Crushing Limiting Beliefs

Free LMS / lead magnet for The Agoge.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth + Edge Functions)
- TanStack Query
- React Router v6
- Vercel hosting

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - typecheck and build for production
- `npm run preview` - preview the production build
- `npm run typecheck` - typecheck only

## Folder layout

```
src/
  components/   reusable UI
  pages/        route components
  hooks/        custom hooks
  lib/          framework-agnostic logic (supabase client, env, logger)
  types/        TypeScript types (database.ts is generated)
```

## Env vars

See `.env.example`. Edge Function secrets live in Supabase, not here.
