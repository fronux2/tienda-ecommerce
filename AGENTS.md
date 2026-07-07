# tienda-mangas — Agent guide

## Commands

- `npm run dev` — dev server with Turbopack
- `npm run build` — production build
- `npm run lint` — ESLint (next/core-web-vitals + next/typescript)
- `npm test` — Jest (jsdom environment). Run single file: `npx jest src/__tests__/Foo.test.tsx`
- `npm run test:watch` — Jest in watch mode

## Project structure

- Next.js 16 App Router, TypeScript strict, `@/*` → `src/*`
- Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`)
- **Supabase** for auth, DB, storage. Three client factories:
  - `src/utils/supabase/client.ts` — browser client (sync, no `await` needed)
  - `src/utils/supabase/server.ts` — server component client (async, uses `cookies()`)
  - `src/utils/supabase/admin.ts` — service-role client (server-only, uses `SUPABASE_SERVICE_ROLE_KEY`)
- **Zustand** stores in `src/store/` (cart, manga, usuario)
- **React Hook Form + Zod** schemas in `src/schemas/`, types in `src/types/supabase.ts`
- **Leaflet + react-leaflet** for maps
- Content is in **Spanish (es_ES)** — UI text, schemas, tests, comments

## Data layer quirks

- Files `src/lib/supabase/services/*.client.ts` and `*.server.ts` mirror the same logic for each entity. The `.client.ts` files incorrectly `await createClient()` even though `createBrowserClient` is sync — do not propagate this pattern.
- Some `.client.ts` files (e.g. `mangas.client.ts`) import from `@/utils/supabase/client` but call `await createClient()` — this is harmless at runtime but incorrect. Use `createClient()` (no await) in new client code.
- Service-role key (`SUPABASE_SERVICE_ROLE_KEY`) must never reach the browser. Use `supabaseAdmin` from `src/utils/supabase/admin.ts` in API routes / server actions only.
- Role check: `rol_id === 2` grants admin access. Enforced in admin routes.
- **Supabase joins with nullable FK**: `roles:rol_id(id,nombre)` returns `null` when `rol_id` is null. Always use optional chaining: `roles?.[0]?.nombre || fallback` — never `roles[0].nombre`.

## Zustand store patterns

- Prefer full state replacement (`set({ key: data })`) over merge helpers that filter duplicates by id. The `mangaStore.addMangas` function filters out items whose `id` already exists — after updating a manga in Supabase, calling `loadMangas` (which used `addMangas`) would silently discard the updated record.

## Admin inline editing

- `MangasTable`, `UsuariosTable`, `CategoriaTable`, `SeriesTable` all follow the same pattern: double-click to edit, Enter to save.
- After `update*()` in Supabase, update the local/Zustand state immediately:
  - **Local state** (`CategoriaTable`): `setLista((prev) => prev.map(...))` replacing the matching item.
  - **Zustand state** (`MangasTable`): call `set({ mangas: await fetchAll() })` (full replace), never a merge function.

## Middleware

`middleware.ts` refreshes Supabase session + redirects unauthenticated users to `/login`. The matcher excludes `_next/static`, `_next/image`, favicon, and static image files.

## Testing patterns

- Jest + `@testing-library/react` with jsdom
- `jest.setup.ts` imports `@testing-library/jest-dom` (globally available matchers)
- Mock zustand stores with `jest.mock('@/store/cartStore', ...)` — see `src/__tests__/Cart.test.tsx` for the canonical pattern
- `moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }` in jest config

## Admin routes

- `/admin`, `/admin/mangas`, `/admin/series`, `/admin/categorias`, `/admin/usuarios`, `/admin/pedidos`
- All share a `'use client'` layout with collapsible sidebar at `src/app/admin/layout.tsx`
- Admin forms are in `src/components/forms/`
- Server actions (with `revalidatePath`) are in `src/components/actions/`

## Env vars (required)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`.env*` files are gitignored.
