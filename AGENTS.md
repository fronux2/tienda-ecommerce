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

## Utilities

- **`src/lib/formatPrice.ts`** — `formatPrice(price: number): string` formatea precios en CLP con separador de miles (`.`), sin decimales. Ej: `29960` → `$29.960`. Usa `Intl.NumberFormat('es-CL', { currency: 'CLP' })`. Importar con `import { formatPrice } from '@/lib/formatPrice'`.

## Data layer quirks

- Files `src/lib/supabase/services/*.client.ts` and `*.server.ts` mirror the same logic for each entity. The `.client.ts` files incorrectly `await createClient()` even though `createBrowserClient` is sync — do not propagate this pattern.
- Some `.client.ts` files (e.g. `mangas.client.ts`) import from `@/utils/supabase/client` but call `await createClient()` — this is harmless at runtime but incorrect. Use `createClient()` (no await) in new client code.
- Service-role key (`SUPABASE_SERVICE_ROLE_KEY`) must never reach the browser. Use `supabaseAdmin` from `src/utils/supabase/admin.ts` in API routes / server actions only.
- Role check: `rol_id === 2` grants admin access. Enforced in admin routes.
- **Supabase joins with nullable FK**: `roles:rol_id(id,nombre)` returns `null` when `rol_id` is null. Always use optional chaining: `roles?.[0]?.nombre || fallback` — never `roles[0].nombre`.
- **Cart service validation**: All functions in `carrito.cliente.ts` (`fetchCartFromSupabase`, `addToCartSupabase`, `removeFromCartSupabase`, `updateCartQuantitySupabase`, `clearCartSupabase`) throw if `usuario_id` is empty — never pass `""` as user ID.
- **NavbarClient cart fetch**: `src/components/NavbarClient.tsx:26` guards with `if (!user?.id) return` before calling `fetchCartFromSupabase`, preventing queries with null/empty user ID on public pages.
- **Guest cart**: Non-registered users can add items to cart (stored in localStorage via `src/lib/cartLocalStorage.ts`). Login is required at checkout (`/checkout` is protected by middleware). When a guest logs in, the local cart is automatically merged into Supabase via `NavbarClient`.
- **Cart store guest logic**: `src/store/cartStore.ts` — all operations (`addToCart`, `removeFromCart`, `clearCart`, `updateQuantity`) skip Supabase calls when `usuario_id` is falsy and persist to localStorage instead. The store types accept `string | null` for `usuario_id`.
- **Direcciones — `numero_casa` field**: The `direcciones` table has a required `numero_casa` (VARCHAR NOT NULL) field. The TypeScript type is `Direccion` in `src/types/supabase.ts:142` with `numero_casa: string`. Zod validation is in `src/schemas/direccionesSchema.ts` (`direccionSchema`) — both the profile direcciones page and checkout page validate with `safeParse` before inserting/updating. The `Pedido.direcciones` join also includes `numero_casa` — always use optional chaining when accessing it in queries.

## Zustand store patterns

- Prefer full state replacement (`set({ key: data })`) over merge helpers that filter duplicates by id. The `mangaStore.addMangas` function filters out items whose `id` already exists — after updating a manga in Supabase, calling `loadMangas` (which used `addMangas`) would silently discard the updated record.

## Button UX patterns

### LoadingButton (`src/components/LoadingButton.tsx`)
Componente reutilizable para botones con operaciones async. Incluye:
- Spinner SVG animado cuando `loading={true}`
- `active:scale-95` para feedback táctil de presionado
- `disabled` automático mientras carga

```tsx
import LoadingButton from '@/components/LoadingButton'

<LoadingButton onClick={handleClick} loading={loading} className="bg-red-600...">
  Añadir al Carrito
</LoadingButton>
```

Para botones que **no** usan `LoadingButton`, agregar las clases `active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed` manualmente.

### Prevención de doble clic en tablas admin
Todas las tablas con edición inline (`MangasTable`, `UsuariosTable`, `CategoriaTable`, `SeriesTable`, `PedidosTable`) usan un `useRef(false)` como flag `guardandoRef` para evitar que `manejarGuardar` se ejecute múltiples veces:

```tsx
const guardandoRef = useRef(false)

const manejarGuardar = async () => {
  if (!editando || guardandoRef.current) return
  guardandoRef.current = true
  try {
    // ... operación async ...
  } finally {
    setEditando(null)
    guardandoRef.current = false
  }
}
```

### Formularios con submit async
Agregar estado `loading` local (o `savingAddress`/`isSubmitting`) que:
1. Se setea a `true` antes de la operación async
2. Se restaura a `false` en `finally`
3. Deshabilita el botón (`disabled={loading}`) y cambia el texto (ej: `'Guardando...'`)

## Admin inline editing

- `MangasTable`, `UsuariosTable`, `CategoriaTable`, `SeriesTable` all follow the same pattern: double-click to edit, Enter to save.
- After `update*()` in Supabase, update the local/Zustand state immediately:
  - **Local state** (`CategoriaTable`): `setLista((prev) => prev.map(...))` replacing the matching item.
  - **Zustand state** (`MangasTable`): call `set({ mangas: await fetchAll() })` (full replace), never a merge function.

## Middleware

`middleware.ts` refreshes Supabase session + redirects unauthenticated users to `/login` **only on protected routes**. Public routes are defined in `publicPaths`: `/`, `/login`, `/auth`, `/mangas`, `/busqueda`, `/cart`, `/error`, `/unauthorized`. The matcher excludes `_next/static`, `_next/image`, favicon, and static image files.

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

## Email notifications (Resend)

- **Provider**: Resend (`resend` package). API key via `RESEND_API_KEY` env var.
- **Service**: `src/lib/email.ts` — lazy-initializes Resend client; returns `{ data: null, error }` if `RESEND_API_KEY` is not set (no crash).
- **API route**: `src/app/api/enviar-email/route.ts` — POST endpoint, protected (verifies Supabase session). Accepts `{ type, to, data }`.
  - `type: "pedido-confirmado"` — sends `PedidoConfirmado` template
  - `type: "pedido-actualizado"` — sends `PedidoActualizado` template
  - `type: "pedido-recibido-admin"` — sends `PedidoRecibidoAdmin` template
- **Templates** (React Email):
  - `src/emails/PedidoConfirmado.tsx` — order summary (items, total, address, date)
  - `src/emails/PedidoActualizado.tsx` — status change (previous → new, contextual message per status)
  - `src/emails/PedidoRecibidoAdmin.tsx` — new order notification for admins (items, total, address, client email)
- **Checkout post-order**: `src/app/checkout/page.tsx:210` — after successful order creation, shows `alert('¡Pedido confirmado con éxito!')` and redirects to `/`.
- **Triggers**:
  - **Checkout** (`src/app/checkout/page.tsx:183`): after successful order creation, sends confirmation to the user's email AND notification to admins (uses `fetch` to the API route, fails silently on error).
  - **PedidosTable** (`src/components/PedidosTable.tsx:37`): when admin changes `estado`, sends update email to the customer's email (only if the value actually changed).
- **Admin notification**: uses `NOTIFICATION_EMAILS` env var (server-side, comma-separated emails, e.g. `admin1@mail.com,admin2@mail.com`). Set in `.env.local` and Vercel.
- **Note**: Without a verified domain in Resend, `EMAIL_FROM` must use `onboarding@resend.dev` as the sender. Add recipient emails as "verified recipients" in Resend dashboard for test mode.
- **Env vars**:
  ```
  RESEND_API_KEY=re_...
  EMAIL_FROM=Tienda Mangas <onboarding@resend.dev>
  NOTIFICATION_EMAILS=admin1@mail.com,admin2@mail.com
  ```

## Env vars (required)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=
  NOTIFICATION_EMAILS=
```

`.env*` files are gitignored.
