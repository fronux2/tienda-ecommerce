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
- **NavbarClient user display**: The avatar circle shows the first letter of the user's email (`user.email?.[0]`) with fallback to `user.id[0]`. The dropdown shows the full email. The `Props` type includes `email?: string`.
- **Guest cart**: Non-registered users can add items to cart (stored in localStorage via `src/lib/cartLocalStorage.ts`). Login is required at checkout (`/checkout` is protected by middleware). When a guest logs in, the local cart is automatically merged into Supabase via `NavbarClient`.
- **Cart store guest logic**: `src/store/cartStore.ts` — all operations (`addToCart`, `removeFromCart`, `clearCart`, `updateQuantity`) skip Supabase calls when `usuario_id` is falsy and persist to localStorage instead. The store types accept `string | null` for `usuario_id`.
- **Cart store stock validation**: `cartStore.addToCart` caps `nuevaCantidad` to `item.mangas?.stock` (or `Infinity` if missing) in both existing and new item branches. `cartStore.updateQuantity` also caps with `Math.max(1, Math.min(cantidad, maxStock))`. If the new quantity equals the current, the operation is a no-op (`return` early).
- **Cart page** (`src/app/cart/page.tsx`): full-page cart view at `/cart` (already public in middleware). Uses `useUser` hook for `userId` + `useCartStore` for state. Shows: item list with image, title (link to detail), price, quantity +/- with stock limit, subtotal, delete button; summary sidebar with total and checkout button; empty state with link to `/mangas`. Uses local `loading` flag for async guard (same pattern as formularios con submit async).
- **Direcciones — `numero_casa` field**: The `direcciones` table has a required `numero_casa` (VARCHAR NOT NULL) field. The TypeScript type is `Direccion` in `src/types/supabase.ts:142` with `numero_casa: string`. Zod validation is in `src/schemas/direccionesSchema.ts` (`direccionSchema`) — both the profile direcciones page and checkout page validate with `safeParse` before inserting/updating. The `Pedido.direcciones` join also includes `numero_casa` — always use optional chaining when accessing it in queries.

## Zustand store patterns

- Prefer full state replacement (`set({ key: data })`) over merge helpers that filter duplicates by id. The `mangaStore.addMangas` function filters out items whose `id` already exists — after updating a manga in Supabase, calling `loadMangas` (which used `addMangas`) would silently discard the updated record.
- **`cartStore.totalItems`**: derived property (`number`) en `CartState` que se recalcula automáticamente en cada operación (`addToCart`, `removeFromCart`, `clearCart`, `updateQuantity`, `setCart`). Suma `item.cantidad` de todos los items del carrito. Úsalo en vez de `cart.length` para mostrar el badge con la cuenta real de unidades.

## Button UX patterns

### AddCardButton2 (`src/components/AddCardButton2.tsx`)
Botón de "Añadir al Carrito" para páginas de detalle de manga. Incluye:
- Fetch del manga via `getMangaById` en `useEffect` para obtener `stock` actualizado
- Se deshabilita automáticamente si el carrito ya tiene la cantidad máxima del stock (`stockAgotado = enCarrito >= manga.stock`)
- Cambia el texto a "Stock agotado en carrito" cuando está deshabilitado
- Usa `LoadingButton` internamente con spinner

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

## Admin pedidos — Filtros y orden

`src/components/PedidosTable.tsx` incluye:
- **Buscador global** — un `<input>` que filtra por todas las columnas (ID, email, dirección, total, estado, método de pago, notas, fechas). Usa `toLowerCase().includes()` sobre cada campo.
- **Filtro por estado** — `<select>` con valores: `""` (Todos), `pendiente`, `procesando`, `enviado`, `entregado`, `cancelado`.
- **Filtro por rango de fechas** — dos `<input type="date">` (desde / hasta). La fecha "hasta" incluye `T23:59:59` para abarcar todo el día.
- **Orden: pendientes primero** — el `useMemo` `pedidosFiltrados` ordena con `ordenEstados: { pendiente: 0, procesando: 1, enviado: 2, entregado: 3, cancelado: 4 }`. A mismo estado, ordena por `fecha_pedido` descendente.
- Los filtros activos se muestran como badges con botón ✕ para limpiarlos individualmente.
- El mensaje "no hay pedidos disponibles" solo se muestra si no hay filtros activos (cuando el array vacío es real, no por filtrado).

## Admin mangas — Filtros y orden

`src/components/MangasTable.tsx` incluye:
- **Buscador global** — un `<input>` que filtra por todas las columnas (título, autor, editorial, ISBN, categoría, serie, estado, descripción, volumen, precio, stock, páginas, idioma). Usa `toLowerCase().includes()` sobre cada campo.
- **Filtro por categoría** — `<select>` con todas las categorías (recibidas como prop del server component `MangaDataLoader`).
- **Filtro por serie** — `<select>` con todas las series (recibidas como prop del server component `MangaDataLoader`).
- **Filtro por estado** — `<select>` con valores: `""` (Todos), `disponible`, `agotado`.
- **Filtro por activo** — `<select>` con valores: `""` (Todos), `true` (Sí), `false` (No).
- **Filtro por popular** — `<select>` con valores: `""` (Todos), `true` (Sí), `false` (No).
- **Ordenamiento** — dos `<select>`: campo (título, precio, stock, volumen, fecha_publicación) y dirección (ascendente / descendente).
- Los filtros activos se muestran como badges con botón ✕ para limpiarlos individualmente.
- El mensaje "no hay mangas disponibles" solo se muestra si no hay filtros activos.

## Mangas listing — Paginación

`src/components/ListMangas.tsx` implementa paginación cliente con "Cargar más" (no páginas numéricas):
- **`ITEMS_POR_PAGINA = 12`** — constante definida fuera del componente.
- **`paginaActual`** — estado `number` que se incrementa al hacer clic en "Cargar más mangas".
- **`mangasPaginados`** — `useMemo` que hace `slice(0, paginaActual * ITEMS_POR_PAGINA)` sobre el array filtrado.
- **`totalPaginas`** — `useMemo` calculado desde `mangasFiltrados.length`.
- **Reseteo**: `setPaginaActual(1)` en el `useEffect` cada vez que cambian filtros o la lista de mangas.
- **UI**: botón "Cargar más mangas" (rojo, solo visible si `paginaActual < totalPaginas`) + texto "Mostrando X de Y resultados".
- **No usar páginas numéricas** — el patrón es "show more" progresivo, no paginación con números.
- **Admin MangasTable** no tiene paginación — muestra todos los mangas en una sola tabla.

## Middleware

`middleware.ts` refreshes Supabase session + redirects unauthenticated users to `/login` **only on protected routes**. Public routes are defined in `publicPaths`: `/`, `/login`, `/auth`, `/mangas`, `/busqueda`, `/cart`, `/error`, `/unauthorized`, `/registro`. The matcher excludes `_next/static`, `_next/image`, favicon, and static image files.

## Testing patterns

- Jest + `@testing-library/react` with jsdom
- `jest.setup.ts` imports `@testing-library/jest-dom` (globally available matchers)
- Mock zustand stores with `jest.mock('@/store/cartStore', ...)` — see `src/__tests__/Cart.test.tsx` for the canonical pattern
- `moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }` in jest config

## Registration (`/registro`)

- **Página pública** en `src/app/registro/page.tsx` — formulario con email, password, confirmar password. Usa `react-hook-form` + `registroSchema` (Zod, incluye `refine` para verificar que las contraseñas coincidan).
- **Server action** en `src/app/registro/actions.ts` — `registrarAction`:
  1. Valida con `registroSchema`
  2. Crea usuario via `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })`
  3. Inicia sesión automática con `supabase.auth.signInWithPassword()`
  4. Redirige a `/`
- En caso de error (email duplicado, etc.) redirige a `/error`.
- El link "Crear cuenta nueva" en `/login` apunta a `/registro`.
- La API route `/api/crear-usuario` (usada por el admin panel) **no se modificó** — coexiste con el nuevo flujo público.

## Webpay Plus (Transbank)

### Overview

Webpay Plus es un flujo de **redirección**: el usuario sale del sitio, paga en la página segura de Transbank, y vuelve a `/webpay/resultado`. Todo es síncrono — no necesita webhook.

```
Checkout → POST /api/webpay/create → Transbank devuelve { token, url }
  → Rediriges (form POST con token_ws) → Usuario paga en Transbank
  → Transbank redirige a /webpay/resultado?token_ws=...
  → /webpay/resultado hace commit + crea pedido en Supabase
```

### Archivos

| Archivo | Propósito |
|---------|-----------|
| `src/lib/transbank.ts` | Inicializa SDK (integración por defecto, producción via `WEBPAY_COMMERCE_CODE` + `WEBPAY_API_KEY`) |
| `src/app/api/webpay/create/route.ts` | `POST` — Crea transacción, retorna `{ token, url }` |
| `src/app/api/webpay/commit/route.ts` | `POST` — Confirma transacción con `token_ws` |
| `src/app/webpay/resultado/page.tsx` | Página de retorno — confirma pago y crea pedido |

### Flujo en checkout (`src/app/checkout/page.tsx`)

- **No hay selector de método de pago** — el pago es siempre Webpay Plus.
- El botón "Pagar con Webpay" guarda un snapshot del carrito en `localStorage` bajo la clave `webpay_pending_order`, genera un `buyOrder` único (`TM-{timestamp}-{random}`), llama a `POST /api/webpay/create`, y redirige al usuario a Transbank via form POST con `token_ws`.
- El pedido **no** se crea antes de la redirección. Se crea después del commit exitoso.

### Flujo en `/webpay/resultado`

- Es un componente cliente sin `useSearchParams` (usa `window.location.search` para evitar errores de prerendering en Vercel).
- Si `response.status === 'AUTHORIZED'`:
  1. Lee el snapshot de `localStorage`
  2. Llama al RPC `crear_pedido_completo` (transacción atómica: valida stock, descuenta, crea pedido + detalle)
  3. Marca carrito como `checked_out`
  4. Limpia `localStorage`
  5. Envía emails (confirmación + admin)
  6. Redirige a `/perfil/pedidos/{id}`
- Si falla (rechazada, timeout, stock insuficiente, etc.): muestra pantalla de error con botón "Volver al carrito".

### Tarjetas de prueba (ambiente integración)

| Tarjeta | CVV | Expiración | Resultado |
|---------|-----|-----------|-----------|
| `4051 8856 0044 6623` | 123 | Cualquier fecha futura | ✅ Aprobada (VISA) |
| `5186 0595 5959 0568` | 123 | Cualquier fecha futura | ❌ Rechazada (Mastercard) |

Autenticación bancaria: RUT `11.111.111-1`, Clave `123`.

### Columnas en Supabase

`pedidos` tabla agregadas vía SQL:
```sql
ALTER TABLE pedidos ADD COLUMN webpay_token TEXT;
ALTER TABLE pedidos ADD COLUMN buy_order TEXT;
```

### Admin pedidos

`src/components/PedidosTable.tsx` muestra dos columnas adicionales:
- **Webpay Token** — truncado con tooltip en hover
- **Buy Order** — orden de compra única

Ambos campos son read-only (sin edición inline) e incluidos en el buscador global.

### Dependencia

- `transbank-sdk` — único paquete necesario. Las credenciales de integración vienen incluidas en el SDK.

### RPC transaccional: `crear_pedido_completo`

La función PostgreSQL `crear_pedido_completo` (creada en el SQL Editor de Supabase) ejecuta todo en una transacción atómica:

1. Valida que la `direccion_id` pertenece al `usuario_id`
2. Recalcula el total desde `mangas.precio` vs `p_total` para verificar consistencia
3. Descuenta stock con `UPDATE ... WHERE stock >= cantidad` (barrera atómica contra race conditions)
4. Si algún item no tiene stock suficiente → `RAISE EXCEPTION` → rollback total
5. Inserta `pedidos` (con `p_total` pagado realmente, no el recalculado)
6. Inserta `detalle_pedidos` con `precio_unitario` desde `mangas.precio` (no desde el cliente)

**Parámetros**: `p_usuario_id UUID`, `p_direccion_id UUID`, `p_total NUMERIC`, `p_token TEXT`, `p_buy_order TEXT`, `p_items JSONB`

**Seguridad**: `SECURITY DEFINER` — se ejecuta con permisos del owner de la función.

### Notas importantes

- `buyOrder` debe ser único por transacción. Formato: `TM-{Date.now()}-{random}`.
- El carrito viaja en `localStorage` (clave `webpay_pending_order`) porque el usuario sale del sitio.
- No hay webhook — el commit es síncrono al volver de Transbank.
- El RPC `crear_pedido_completo` reemplazó las 3 queries separadas (insert pedido + insert detalle + decrement_stock) que antes generaban pedidos huérfanos si `decrement_stock` fallaba.
- **Stock check en checkout**: `src/app/checkout/page.tsx` valida stock antes de enviar al usuario a Transbank (pre-check de UX, la barrera real es el RPC).
- Si el usuario nunca vuelve (cierra ventana), la transacción queda huérfana. En producción se programa un cron para liberar stock.
- Para producción: registrar comercio en Transbank y setear `WEBPAY_COMMERCE_CODE` y `WEBPAY_API_KEY` en env vars. El código cambia automáticamente a producción si ambas están presentes.

## Checkout

- **Direcciones**: En `src/app/checkout/page.tsx`, al agregar una nueva dirección se usa `.select('*')` en el insert para capturar el ID y auto-seleccionarla (`setAddressId(data[0].id)`), sin que el usuario tenga que elegirla manualmente.
- **Pago**: Reemplazado por Webpay Plus (ver sección arriba). Ya no hay selector de método de pago ni creación directa del pedido en checkout.

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
- **Checkout post-order**: `src/app/checkout/page.tsx:210` — after successful order creation, redirects to `/perfil/pedidos/{id}` (the order detail page).
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

## Manga detail page (`/mangas/[id]`)

- **Server component** (`page.tsx`) fetches the manga via `getMangaById()` from `mangas.server.ts` and passes it as `manga: Manga | null` prop to the client component.
- **Client component** (`MangaDetailsclient.tsx`) receives `manga` prop directly — does **not** depend on Zustand store for initial data.
- This pattern ensures direct URL access, refresh, and sharing all work correctly (the store was only populated on the listing page, causing "Manga no encontrado" on refresh).
- `getMangaById` returns an array (`.eq('id', id)` on PK): use `data?.[0] ?? null`.

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
