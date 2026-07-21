# tienda-mangas — Agent guide

## Idioma

El desarrollador habla **español**. Todas las respuestas, explicaciones y comentarios deben escribirse en español.

## Flujo de trabajo incremental (correcciones)

Cuando el desarrollador pida corregir múltiples problemas encontrados en una auditoría:

1. **Corregir UN solo problema a la vez**
2. **Detenerse y preguntar** al desarrollador si quiere probar en producción antes de continuar
3. **Esperar confirmación** para avanzar al siguiente problema
4. Nunca hacer más de una corrección sin preguntar primero

Esto evita introducir regresiones silenciosas que son difíciles de rastrear.

## Commands

- `npm run dev` — dev server with Turbopack
- `npm run build` — production build
- `npx eslint src/` — ESLint directo (Next.js 16.2 eliminó `next lint` de la CLI)
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
- **Component naming**: PascalCase para archivos de componentes React (`MangaCard.tsx`, `AddToCartButton.tsx`, `UploadImgForm.tsx`). No usar `camelCase` ni sufijos numéricos.

## Utilities

- **`src/lib/formatPrice.ts`** — `formatPrice(price: number): string` formatea precios en CLP con separador de miles (`.`), sin decimales. Ej: `29960` → `$29.960`. Usa `Intl.NumberFormat('es-CL', { currency: 'CLP' })`. Importar con `import { formatPrice } from '@/lib/formatPrice'`.

- **`src/lib/regionesChile.ts`** — `REGIONES_CHILE` (`as const` string array) y `RegionChile` (tipo). Contiene las 16 regiones de Chile. Se usa tanto en el schema Zod (`direccionSchema` valida campo `region` con `z.enum(['', ...REGIONES_CHILE]).optional()`) como en los `<select>` del formulario de direcciones (perfil y checkout). Importar con `import { REGIONES_CHILE } from '@/lib/regionesChile'`.

## Data layer quirks

- Files `src/lib/supabase/services/*.client.ts` and `*.server.ts` mirror the same logic for each entity. The `.client.ts` files incorrectly `await createClient()` even though `createBrowserClient` is sync — do not propagate this pattern.
- Some `.client.ts` files (e.g. `mangas.client.ts`) import from `@/utils/supabase/client` but call `await createClient()` — this is harmless at runtime but incorrect. Use `createClient()` (no await) in new client code.
- Service-role key (`SUPABASE_SERVICE_ROLE_KEY`) must never reach the browser. Use `supabaseAdmin` from `src/utils/supabase/admin.ts` in API routes / server actions only.
- Role check: `rol_id >= 2` grants admin/moderator access (rol_id: 1=cliente, 2=moderador, 3=admin). Enforced in admin server components and Navbar. Both desktop dropdown and mobile menu use `rolId! >= 2` consistently.
- **Role display in admin table**: `UsuariosTable` resolves role name via `getNombreRol(usuario.rol_id)` using the local `roles` array (fetched separately via `getRoles`), not via Supabase join. The store `updateUsuarioEnStore` sets `roles: [{ id: Number(valor), nombre }]` (array, not object).
- **Admin role assignment restriction**: Only users with `rol_id === 3` (admin) can assign the admin role. `UsuariosTable` receives `usuarioRolId` as a prop from the server component and filters the role `<select>` to exclude `rol.id === 3` for non-admins. Additionally, moderators (`rol_id === 2`) cannot edit the role of users who are currently admins — the role cell is visually disabled and `updateUsuario` validates server-side that moderators cannot modify admin roles.
- **Cart service validation**: All functions in `carrito.client.ts` (`fetchCartFromSupabase`, `addToCartSupabase`, `removeFromCartSupabase`, `updateCartQuantitySupabase`, `clearCartSupabase`) throw if `usuario_id` is empty — never pass `""` as user ID.
- **NavbarClient cart fetch**: `src/components/NavbarClient.tsx:28` guards with `if (!user?.id) return` before calling `fetchCartFromSupabase`, preventing queries with null/empty user ID on public pages.
- **NavbarClient user display**: The avatar circle shows the first letter of the user's email (`user.email?.[0]`) with fallback to `user.id[0]`. The dropdown shows the full email. The `Props` type includes `email?: string`.
- **Guest cart**: Non-registered users can add items to cart (stored in localStorage via `src/lib/cartLocalStorage.ts`). Login is required at checkout (`/checkout` is protected by middleware). When a guest logs in, the local cart is automatically merged into Supabase via `NavbarClient`.
- **Cart store guest logic**: `src/store/cartStore.ts` — all operations (`addToCart`, `removeFromCart`, `clearCart`, `updateQuantity`) skip Supabase calls when `usuario_id` is falsy and persist to localStorage instead. The store types accept `string | null` for `usuario_id`.
- **Cart store stock validation**: `cartStore.addToCart` caps `nuevaCantidad` to `item.mangas?.stock` (or `Infinity` if missing) in both existing and new item branches. `cartStore.updateQuantity` also caps with `Math.max(1, Math.min(cantidad, maxStock))`. If the new quantity equals the current, the operation is a no-op (`return` early).
- **Cart page** (`src/app/cart/page.tsx`): full-page cart view at `/cart` (already public in middleware). Uses `useUser` hook for `userId` + `useCartStore` for state. Shows: item list with image, title (link to detail), price, quantity +/- with stock limit, subtotal, delete button; summary sidebar with total and checkout button; empty state with link to `/mangas`. Uses local `loading` flag for async guard (same pattern as formularios con submit async).
- **Direcciones — `numero_casa` field**: The `direcciones` table has a required `numero_casa` (VARCHAR NOT NULL) field. The TypeScript type is `Direccion` in `src/types/supabase.ts:142` with `numero_casa: string`. Zod validation is in `src/schemas/direccionesSchema.ts` (`direccionSchema`) — both the profile direcciones page and checkout page validate with `safeParse` before inserting/updating. The `Pedido.direcciones` join also includes `numero_casa` — always use optional chaining when accessing it in queries.

## Zustand store patterns

- Prefer full state replacement (`set({ key: data })`) over merge helpers that filter duplicates by id. The `mangaStore.addMangas` function filters out items whose `id` already exists — after updating a manga in Supabase, calling `loadMangas` (which used `addMangas`) would silently discard the updated record.
- **`cartStore.totalItems`**: derived property (`number`) en `CartState` que se recalcula automáticamente en cada operación (`addToCart`, `removeFromCart`, `clearCart`, `updateQuantity`, `setCart`). Suma `item.cantidad` de todos los items del carrito. Úsalo en vez de `cart.length` para mostrar el badge con la cuenta real de unidades.
- **⚠️ Anti-patrón: selectores con objeto nuevo** — NUNCA hacer:
  ```tsx
  // ❌ Crea objeto nuevo cada render → loop infinito (React error #185)
  const { cart, addToCart } = useCartStore((state) => ({
    cart: state.cart,
    addToCart: state.addToCart,
  }))
  ```
  Usar selectores individuales:
  ```tsx
  // ✅ Cada selector retorna referencia estable
  const cart = useCartStore((s) => s.cart)
  const addToCart = useCartStore((s) => s.addToCart)
  ```

## Button UX patterns

### AddToCartButton (`src/components/AddToCartButton.tsx`)
Botón de "Añadir al Carrito" para páginas de detalle de manga. Incluye:
- Fetch del manga via `getMangaById` en `useEffect` para obtener `stock` actualizado (con `try/catch`)
- Usa selectores individuales de Zustand (`useCartStore((s) => s.cart)` y `useCartStore((s) => s.addToCart)`) — nunca destructurar objeto en selector
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

- Jest 30 + `@testing-library/react` with jsdom + `@testing-library/user-event`
- `jest.setup.ts` imports `@testing-library/jest-dom` (globally available matchers)
- `moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }` in jest config
- Run single file: `npx jest src/__tests__/Foo.test.tsx`
- All test content is in **Spanish** (describe/it names, assertions, mock data)

### Test files (19 suites, 185 tests)

| Archivo | Cubre |
|---------|-------|
| `cartStore.test.ts` | addToCart, removeFromCart, clearCart, updateQuantity, setCart — auth/guest/stock-clamp/error |
| `mangaStore.test.ts` | setMangas, addMangas, loadMangas, loadMangasPopulares — dedup, merge |
| `usuarioStore.test.ts` | getUsuarios, updateUsuarioEnStore — generic fields, rol_id+roles |
| `formatPrice.test.ts` | CLP formatting via Intl.NumberFormat |
| `CategoriaTable.test.tsx` | Render, inline edit, Enter/blur save, error handling, empty state |
| `SeriesTable.test.tsx` | Render, search filter, clear, inline edit, empty state |
| `MangasTable.test.tsx` | 13-field text search, dropdown filters, sorting, inline edit |
| `PedidosTable.test.tsx` | Data fetch on mount, date/status/search filters, status sort, inline edit |
| `UsuariosTable.test.tsx` | Render users, inline edit email/rol, role permissions, empty state |
| `CartPage.test.tsx` | Empty state, items render, +/- buttons, remove, clear, totals |
| `Cart.test.tsx` | Toggle panel, products, clearCart, userId=null renders button |
| `CrearMangaForm.test.tsx` | Render, validation errors, submit with UUID IDs, upload error, fetch error |
| `CrearCategoriaForm.test.tsx` | Form render and submit |
| `EditarCategoriaForm.test.tsx` | Form render and submit |
| `schemas/registroSchema.test.ts` | Email, password, confirm-password, refine |
| `schemas/loginSchema.test.ts` | Email, password |
| `schemas/direccionSchema.test.ts` | All fields including numero_casa, regionesChile |
| `schemas/nuevoMangaSchema.test.ts` | All manga fields, UUID validation, es_popular preprocess |
| `schemas/seriesSchema.test.ts` | Nombre, manga_ids |

### Mocking patterns

**Zustand stores** — mock the entire module, return a plain object (no `get`/`set`):
```ts
jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn((selector) => {
    const state = { cart: [], removeFromCart: jest.fn(), ... }
    return selector ? selector(state) : state
  }),
}))
```

**Supabase services** — mock each exported function:
```ts
jest.mock('@/lib/supabase/services/mangas.client', () => ({
  getMangas: jest.fn().mockResolvedValue([...]),
  crearManga: jest.fn().mockResolvedValue({ error: null }),
}))
```

**Next.js navigation** — required when component uses `useRouter()`:
```ts
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))
```

**Next.js Image/Link** — required in jsdom:
```ts
jest.mock('next/image', () => (props) => <img alt={props.alt} />)
jest.mock('next/link', () => (props) => <a href={props.href}>{props.children}</a>)
```

**`global.fetch`** (PedidosTable) — must use `global.fetch`, not `jest.spyOn(window, 'fetch')`:
```ts
global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [...] })
```

**User event** — prefer `@testing-library/user-event` over `fireEvent`:
```ts
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')
await user.dblClick(element)  // for inline editing
await user.selectOptions(select, 'value')
await user.upload(fileInput, file)
```

### Query patterns

- **Ambiguous labels** (MangasTable): filter `<select>` options share text with table data → query `<tbody>` children specifically
- **Multiple matches**: use `getAllByText` / `getAllByRole` when text appears more than once (e.g. unit price + subtotal)
- **Empty state assertions**: use `getAllByRole('row')` to count rows (not `toHaveCount` which doesn't exist in jest-dom)
- **Role permissions**: check CSS classes on `<td>` elements (e.g. `text-gray-400` for disabled)

### Schema bug fix

`src/schemas/mangasSchema.ts` — `es_popular` field: the `<select>` sends string values (`"true"`, `"false"`, `""`) but the schema originally had `z.boolean()`. Fixed with `z.preprocess()` to coerce strings to booleans. Without this, the form could never submit with `es_popular` selected.

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
- **Client component** (`MangaDetailClient.tsx`) receives `manga` prop directly — does **not** depend on Zustand store for initial data.
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
