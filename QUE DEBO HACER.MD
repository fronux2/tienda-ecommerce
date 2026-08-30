# Plan de Unificación de Diseño — MangaNihon

> Checklist vivo. Marca cada casilla cuando termines ese ítem y para ahí la próxima vez. No hace falta hacer una fase completa de una sentada.

## Dirección (por qué, no solo qué)

La marca **ya existe y funciona**: crema `#FFF8F0` (papel de manga), negro (tinta sumi), rojo `red-600` (sello/hinomaru). Eso se ve en Hero, Navbar y MangaCard y se siente intencional — **no hay que inventar una paleta nueva**.

El problema real tiene dos causas concretas, no "mal gusto":

1. **Cero tokens.** `globals.css` no define ninguna variable — cada archivo escribe `bg-red-600`, `#FFF8F0`, `text-gray-700` a mano. 274 usos de color repartidos en 38 archivos, 56 usos del hex crudo en 17 archivos. Imposible mantener consistencia así, aunque cada dev lo intente.
2. **El panel Admin vive en otro mundo.** La tienda usa rojo/negro/crema con disciplina razonable. Admin (`MangasTable`, `PedidosTable`, `SeriesTable`, `CategoriaTable`) inventó cada uno su propia paleta de badges — azul, índigo, púrpura, naranja, rosado, amarillo — sin relación entre sí ni con la marca. Por eso se siente "revuelto": son dos productos visualmente distintos.

**Plan:** tokens primero (fundación), luego dos componentes compartidos (`Button`, `Badge`) que todo lo demás consume, después pasar tienda y admin por ese sistema. Así cada fase es independiente y puedes parar donde quieras.

**Excluido del alcance:** `src/emails/*.tsx` (React Email exige estilos inline, no tocar) y `src/__tests__/` (solo si cambian clases que los tests verifican directamente).

---

## Fase 0 — Tokens base (fundación · ~20 min · no rompe nada)

Define las variables en `globals.css` con `@theme` de Tailwind v4. Las clases actuales siguen funcionando mientras migras.

- [x] `--color-primary` / `--color-primary-hover` / `--color-primary-light` (el rojo de marca, consolidado)
- [x] `--color-cream` (reemplaza el hex `#FFF8F0` repetido)
- [x] `--color-ink` (el negro de marca — navbar, footer, detalle de manga)
- [x] `--color-surface` / `--color-surface-alt` (blanco / gris muy claro para cards y fondos alternos)
- [x] `--color-text` / `--color-text-secondary` / `--color-text-muted` (consolida el actual gray-500/600/700/800 usado sin criterio para lo mismo)
- [x] `--color-border` (consolida gray-200/300)
- [x] Semánticos, **distintos del rojo de marca** para que un badge de admin no se confunda con una acción destructiva: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`

**Hecho** (2026-08-30): tokens definidos en `src/app/globals.css` con `@theme`. Cambio sin commitear todavía — revisar visualmente antes de commitear. Ningún componente los usa aún (eso es Fase 1).

---

## Fase 1 — Tienda: quitar hex crudo y unificar rojo/crema

Reemplazar `bg-[#FFF8F0]` → `bg-cream`, `text-red-600` → `text-primary`, etc. Archivo por archivo, bajo riesgo visual (mismo color, solo pasa a ser token).

- [x] `components/Hero.tsx`
- [x] `components/NavbarClient.tsx` (el más grande — 10 usos hex + varios red)
- [x] `components/MangaCard.tsx`
- [x] `components/MangaDetailClient.tsx` (tema oscuro — solo migrados los valores exactos: cream/ink/primary/success/danger; grises oscuros de fondo dejados igual a propósito, ver nota abajo)
- [x] `components/Footer.tsx`
- [x] `components/Cart.tsx`
- [x] `components/About.tsx`
- [x] `components/SectionMap.tsx`
- [x] `components/Popular.tsx`
- [x] `components/ListMangas.tsx`
- [x] `components/Invitation.tsx`
- [x] `app/login/page.tsx`
- [x] `app/registro/page.tsx`
- [x] `app/cart/page.tsx`
- [x] `app/error/page.tsx`
- [x] `app/perfil/page.tsx` + `perfil/datos`, `perfil/direcciones`, `perfil/pedidos` (+ `[id]`)
- [x] `components/perfil/PerfilLayout.tsx`

---

## Fase 2 — Componentes compartidos (el apalancamiento real)

Antes de tocar más archivos de Admin, crear los dos componentes que van a absorber toda la duplicación de badges/botones.

- [x] **`Button`**: variantes `primary` / `secondary` / `danger` / `ghost` (+ `size` sm/md/lg), agregadas como props opcionales a `LoadingButton` — sin variant/size, el componente se comporta exactamente igual que antes (los 12 call sites existentes no se tocaron). Reemplazado el `Button` local duplicado dentro de `NavbarClient.tsx` (menú móvil, botón "Cerrar sesión"). **Pendiente:** los estilos de botón copy-pasteados en login/registro/perfil no se tocaron todavía (bajo riesgo pero se dejó fuera de esta pasada).
- [x] **`Badge`** (`src/components/Badge.tsx`): componente semántico único (`variant="success" | "warning" | "danger" | "info" | "neutral"`), pill con `bg-{color}/10 text-{color} border-{color}/20` usando los tokens de Fase 0. Reemplaza:
  - [x] `components/perfil/EstadoBadge.tsx` — migrado a usar `Badge` por dentro (misma prop `estado`, cero cambios en call sites). Verificado visualmente en `/perfil/pedidos`.
  - [ ] el badge-map duplicado dentro de `MangasTable.tsx` (categorías: 40 usos de color) — Fase 3
  - [ ] el badge-map duplicado dentro de `PedidosTable.tsx` (24 usos) — Fase 3
  - [ ] el badge-map duplicado dentro de `SeriesTable.tsx` (5 usos) — Fase 3

**Hecho** (2026-08-30): `npx tsc --noEmit` sin errores nuevos (solo los preexistentes de `__tests__`, sin relación). Verificado en el navegador logueado: botón "Cerrar sesión" pixel-idéntico al anterior (bg `#dc2626`, radio 6px, padding 8px/16px, 18px), badge "Procesando" en `/perfil/pedidos` se ve como pill celeste discreto. Sin commitear todavía.

---

## Fase 3 — Admin: aplicar el sistema

Con `Button` y `Badge` ya listos, esto es reemplazar, no rediseñar.

- [x] `components/MangasTable.tsx` — mayor impacto. Los 6 chips de filtro (búsqueda/categoría/serie/estado/activo/popular, antes 6 colores arbitrarios sin criterio) ahora son `Badge variant="neutral"`; círculo de volumen → tokens neutral; stock (success/warning/danger según cantidad), estado (success/danger/neutral), activo (success/danger) y popular (info/neutral) ahora usan `Badge`. Verificado visualmente en `/admin/mangas`.
- [x] `components/PedidosTable.tsx` — 4 chips de filtro → `Badge variant="neutral"`; el estado del pedido ahora reusa `EstadoBadge` directamente (mismo mapeo que `/perfil/pedidos`, cero duplicación). Verificado visualmente en `/admin/pedidos`.
- [x] `components/SeriesTable.tsx` — no tenía badges tipo pill; el único candidato era el botón "Recargar datos" (estado vacío), migrado a `LoadingButton variant="secondary" size="sm"`. El stat box "Total de series" y el focus ring índigo quedaron sin tocar (no son pills, candidatos para Fase 4).
- [x] `components/CategoriaTable.tsx` / `CategoriaDataTable.tsx` — revisado, no tiene pills ni botones que migrar (solo texto plano). Sin cambios.
- [x] `components/UsuariosTable.tsx` — revisado, no tiene pills ni botones (rol se muestra como texto plano). Sin cambios.
- [x] `components/UploadImgForm.tsx` — `LoadingButton` migrado de clases azules manuales a `variant="primary"`; mensaje de error a `text-danger`.
- [x] `app/admin/*`:
  - `layout.tsx` — sidebar migrado a tokens (`bg-ink`, `text-cream`, `hover:text-primary`, `border-primary`, `hover:bg-cream`).
  - `page.tsx` (dashboard) — los 3 CTA (`Crear Nuevo Manga/Serie/Usuario`) tenían colores arbitrarios (azul/verde/púrpura) sin significado semántico; unificados a rojo de marca (son botones de igual peso, no estados). Fondo migrado a `bg-surface-alt`/`text-text`.
  - `mangas/new`, `categorias`, `pedidos`, `series`, `usuarios` (list pages) — revisados, sin colores que migrar (solo auth + wrappers).
  - `series/new/page.tsx`, `usuarios/new/page.tsx` — `LoadingButton` migrado a `variant="primary" size="lg"`; mensajes de éxito/error a tokens.
- [x] `components/forms/CrearMangaForm.tsx` (34 usos) — todos los inputs/selects/textarea migrados de `border-gray-300`/`focus:ring-blue-400` a `border-border`/`focus:ring-primary`; mensajes de error a `text-danger`; caja de error a `bg-danger/10 border-danger/30`; checkbox a `text-primary`/`border-border`; botón submit a `variant="primary" size="lg"`.

**Hecho** (2026-08-30): `npx tsc --noEmit` sin errores nuevos fuera de `__tests__`. Verificado visualmente en el navegador (logueado): `/admin/mangas`, `/admin/pedidos`, `/admin/series`, `/admin` (dashboard) y `/admin/mangas/new`. Sin commitear todavía — Fase 3 completa.

---

## Fase 4 — Pulido final (opcional, cuando las anteriores estén listas)

- [x] Revisar estados `hover` / `focus` / `disabled` — **completo dentro del alcance de Admin** (que es todo lo tocado hoy). Se agregó `focus-visible:ring` a los botones "×" de los chips de filtro (Mangas/Pedidos/Series), a los 3 CTA del dashboard (`admin/page.tsx`) y a los links del sidebar (`admin/layout.tsx`). El toggle del sidebar era un `<div onClick>` sin soporte de teclado — se convirtió a `<button>` real con `aria-label`. Se encontró y corrigió además un default sin migrar en `EditableCell.tsx` (`focus:ring-blue-500` — el valor por defecto de `inputClassName`, usado por los campos de MangasTable que no pasan uno explícito). No se auditó la tienda (login/registro/perfil/checkout/cart), que ya tenía sus propios focus states de Fase 1 y queda fuera del alcance de hoy.
- [x] Uniformar radios de borde — **completo dentro del alcance de Admin**. Escala aplicada: `rounded-full` (pills/avatares/badges), `rounded-md` (inputs y botones, tier "small"), `rounded-lg` (cards, tablas, cajas de alerta, tier "medium"), `rounded-xl` (contenedor principal de Admin y cards de login/registro, tier "large" — ya eran consistentes, no requirió cambios). Se corrigió el `rounded` (4px, sin tier) suelto en inputs de `CrearMangaForm.tsx`, `series/new`, `usuarios/new`, `CategoriaTable.tsx`, `UsuariosTable.tsx`, `UploadImgForm.tsx` y `EditableCell.tsx` (default compartido) → todos a `rounded-md`. La tienda (checkout/cart/webpay/perfil) no se tocó — mismo motivo que el ítem anterior.
- [x] Pasada de `text-gray-*` sueltos que no se migraron en fases anteriores — **completa** en `MangasTable.tsx`, `PedidosTable.tsx`, `SeriesTable.tsx`, `CategoriaTable.tsx`, `UsuariosTable.tsx` y los formularios `series/new`/`usuarios/new` (stat boxes, thead/th/tbody, hover de fila, labels, inputs, mensajes de error/éxito, estados vacíos). Todos migrados a `text-text`/`text-text-secondary`/`text-text-muted`, `bg-surface`/`bg-surface-alt`, `border-border`, `focus:ring-primary`, y los boxes de "Total de X" antes en azul/púrpura/índigo ahora usan `bg-primary/10 text-primary` (un solo acento de marca en vez de un color arbitrario por tabla).

**Hecho** (2026-08-30): Fase 4 completa dentro del alcance de Admin (los 3 ítems). `npx tsc --noEmit` sin errores nuevos fuera de `__tests__`. Verificado visualmente en `/admin/mangas` (incluyendo navegación por teclado del toggle del sidebar y foco visible en selects/chips), `/admin/pedidos`, `/admin/series`, `/admin/usuarios`, `/admin/categorias`.

**Pendiente real (fuera del alcance de hoy):** ~~aplicar la misma escala de radios y auditoría de hover/focus/disabled a la tienda~~ — **hecho** (ver sección "Fase 4 extendida a la tienda" más abajo).

---

## Fase 4 extendida a la tienda (2026-08-30, mismo día)

Se aplicó la misma escala de radios + colores/tokens + hover/focus/disabled que en Admin, ahora a toda la tienda:

- **`checkout/page.tsx`** — no se había tocado en ninguna fase anterior (tenía `blue-600`/`green-600` crudos). Migrado completo: botón "Agregar dirección" → `variant`-secondary manual (outline ink), inputs → `border-border rounded-md focus:ring-primary`, "Guardar dirección" → `bg-primary`, botón final "Pagar con Webpay" → `bg-primary rounded-lg` (antes verde) con focus-visible ring. Solo cambios de clases CSS, ningún handler del flujo de pago se tocó.
- **`webpay/resultado/page.tsx`** — spinner/success/error migrados a `border-primary`/`text-success`/`text-danger`/`text-text-secondary`; botón "Volver al carrito" → `bg-primary rounded-lg` + focus ring.
- **`Cart.tsx`** (panel lateral) y **`app/cart/page.tsx`** — grises sueltos (`hover:bg-gray-100`, `hover:bg-gray-800`) → `hover:bg-surface-alt`/`hover:bg-ink/90`; radios `rounded`→`rounded-md`/`rounded-lg`; focus-visible ring en todos los botones (toggle, cerrar, +/-, eliminar, vaciar, comprar).
- **`perfil/page.tsx`** — los 3 tiles de acceso rápido (antes `from-blue-50`/`from-green-50` crudos, ya documentado como decisión deliberada) migrados a `from-info/5`/`from-success/5` — mantienen la diferenciación de color por tile pero atada a tokens semánticos en vez de literales Tailwind.
- **`perfil/datos/page.tsx`** — input readonly → tokens; botón "Cerrar sesión" migrado a `LoadingButton variant="secondary"` (elimina duplicación); "Cambiar contraseña" migrado a `variant="primary"`.
- **`perfil/direcciones/page.tsx`** — 7 inputs + caja de formulario → tokens; botón "Guardar/Actualizar" → `bg-success` (antes `green-600`); "Editar" → `text-info` (antes `blue-600`, mantiene la distinción semántica editar=info ya documentada); "Eliminar" ya era `text-primary`.
- **`perfil/pedidos/page.tsx`** y **`perfil/pedidos/[id]/page.tsx`** — tabs de filtro, cards, "Gratis" (→ `text-success`) y separadores migrados.
- **`TimelineEstado.tsx`** — no se había tocado; migrado completo de `red-400/green-500/gray-300` a `border-danger`/`bg-success`/`border-border`.
- **`PerfilLayout.tsx`** — mismo fix de accesibilidad que `admin/layout.tsx`: el toggle del sidebar pasó de `<div onClick>` a `<button>` con `aria-label`, más focus-visible en los links del menú.
- **`direccion/page.tsx`**, **`busqueda/page.tsx`** — autocompletar de direcciones/búsqueda migrados a tokens (no eran parte de ningún flujo documentado antes, encontrados en el barrido).
- **`login/page.tsx`**, **`registro/page.tsx`** — el botón secundario ("Crear cuenta"/"Iniciar sesión", outline) tenía `hover:bg-gray-100` suelto; el submit primario no tenía focus-visible ring. Ambos corregidos.
- **`app/loading.tsx`**, **`components/Loading.tsx`** — spinners globales migrados (`border-blue-500`→`border-primary`, `text-gray-600`→`text-text-secondary`).
- **`AddToCartButton.tsx`** — usaba `bg-red-600` crudo en vez del token; migrado a `LoadingButton variant="primary"`.
- **`MangaDetailClient.tsx`** — **los grises oscuros se dejaron intactos a propósito** (mismo motivo documentado en Fase 1: tema oscuro real, tokens de texto calibrados para fondo claro). Solo se corrigieron los radios sueltos (`rounded`→`rounded-md`/`rounded-lg`) sin tocar ningún color.

`npx tsc --noEmit` sin errores nuevos fuera de `__tests__` en todo el proceso. Verificado visualmente: `/cart` (vacío y con producto), `/mangas` (botón "Añadir al Carrito"), `/checkout` (formulario de dirección completo, incluyendo el submit).

---

## Fase 5 — Modo oscuro/claro (2026-08-30, mismo día)

Toggle manual con `localStorage`, respetando `prefers-color-scheme` del sistema la primera visita. **Alcance: toda la tienda y Admin** (Admin arrancó anclado al claro por decisión inicial del usuario, pero se extendió el mismo día — ver más abajo).

**Arquitectura** (`src/app/globals.css`):
- Los tokens de superficie/texto ya existentes (`cream`, `ink`, `surface`, `surface-alt`, `text*`, `border`, semánticos) ahora son **adaptativos**: se redefinen dentro de una clase `.dark` en el `<html>`, y como todos los componentes ya usaban estos tokens (gracias a Fases 0-4), heredan el modo oscuro automáticamente sin tocar cada archivo.
- `--color-primary` (rojo de marca) **no cambia** con el tema — es el único acento, se mantiene igual en ambos modos.
- **Tokens nuevos `chrome` / `chrome-foreground`**: navbar, footer, overlay del menú móvil y los botones "Ir a pagar"/"Comprar" usaban `bg-ink`/`text-cream` como *fondo permanente casi-negro* (barra de marca), no como superficie de página. Si `ink`/`cream` se vuelven adaptativos, esas barras se habrían invertido a blanco — por eso se separaron en un par de tokens **constantes** (nunca redefinidos en `.dark`) para esos ~10 usos puntuales. El resto de `text-ink`/`bg-cream` (títulos, fondos de página) sigue usando los tokens adaptativos normales.
- **`.admin-scope`**: reasigna los tokens adaptativos a sus valores claros dentro de `admin/layout.tsx`. Como los custom properties de CSS resuelven por el ancestro más cercano, esto "ancla" todo lo que cuelga de `/admin/*` al modo claro sin importar que `.dark` esté activo en el `<html>`.
- `<body>` ahora tiene `bg-cream text-text` explícito — antes no tenía fondo, así que los huecos entre secciones se veían blanco puro en modo oscuro (bug real encontrado al probar).

**Componentes nuevos:**
- `ThemeToggle.tsx` — botón sol/luna (ícono según el tema activo), en el navbar (desktop) y en el menú móvil.
- Script bloqueante inline en `app/layout.tsx` (antes de `<Navbar />`) que lee `localStorage` o `prefers-color-scheme` y agrega `.dark` al `<html>` antes del primer paint (evita parpadeo). `<html>` lleva `suppressHydrationWarning` porque el script puede tocar el DOM antes de que React hidrate.

**Bugs encontrados y corregidos durante la verificación** (no eran parte de dark mode, ya existían):
- `Invitation.tsx` tenía un hex crudo escondido dentro de un gradiente (`to-[#FFF0E0]`) que ningún grep de fases anteriores detectó porque no es un `bg-[#...]` plano — migrado a `to-surface-alt`.
- `NavbarClient.tsx` tenía un `hover:bg-red-50` suelto en el dropdown ("Cerrar sesión") — migrado a `hover:bg-danger/10`.

Verificado visualmente en ambos temas: home completo (Hero/Populares/Invitation/Footer), login, `/cart`, y confirmado que `/admin/mangas` se mantiene en claro con el toggle en oscuro. `npx tsc --noEmit` sin errores nuevos.

**Bug reportado por el usuario (2026-08-30, mismo día) — corregido:** en Admin, con el tema oscuro activo, el fondo se quedaba claro (correcto, es lo esperado) **pero las letras se volvían claras también** — texto claro sobre fondo claro, ilegible. Visto en `/admin/usuarios` y la sidebar.

**Causa:** `.admin-scope` solo redefinía las *custom properties* (`--color-text`, etc.), pero nunca fijaba la propiedad `color` en sí sobre el propio contenedor. El `<body>` (agregado en esta misma Fase 5 para arreglar los huecos blancos) sí tiene `text-text` aplicado, que en modo oscuro es un color claro. Cualquier elemento de Admin sin una clase `text-*` explícita heredaba ese `color` claro directamente del `<body>` — el mecanismo de custom properties de `.admin-scope` nunca entraba en juego para esos elementos porque `color` es una propiedad heredada normal, no algo que sus descendientes recalculen desde `var(--color-text)` a menos que tengan la clase.

**Fix:** `.admin-scope` ahora también fija `color: #111827;` directamente (no solo la variable), así el contenedor raíz de Admin tiene su propio `color` correcto para heredar hacia abajo, sin depender de que cada elemento tenga una clase `text-*` explícita.

---

### Admin: modo oscuro real (2026-08-30, mismo día, con `/interface-design`)

El usuario pidió que Admin también soportara modo oscuro de verdad en vez de quedar anclado al claro — usó explícitamente la skill `/interface-design` para esto.

**Hallazgo clave:** la arquitectura ya estaba lista. Las tablas (`MangasTable`, `PedidosTable`, `SeriesTable`, `CategoriaTable`, `UsuariosTable`) y formularios (`CrearMangaForm`, `series/new`, `usuarios/new`) ya consumían los tokens adaptativos (`text-text`/`text-text-secondary`/`text-text-muted`/`bg-surface`/`bg-surface-alt`/`border-border`) desde las Fases 3-4 — lo único que bloqueaba el modo oscuro era la clase `.admin-scope`, que los anclaba al valor claro a propósito. Un grep de `gray-|blue-|purple-|...` sobre todos los archivos de Admin no encontró ningún literal suelto, confirmando que la Fase 3-4 había sido exhaustiva.

**Cambios:**
- Se eliminó `.admin-scope` de `globals.css` y de `admin/layout.tsx` — sin ese anclaje, Admin hereda `.dark` igual que el resto del sitio.
- El contenedor raíz de Admin y la barra de toggle del sidebar (antes `bg-ink`/`text-cream`, fondo negro fijo) pasaron a `bg-chrome`/`text-chrome-foreground` — el mismo tratamiento que ya usa el navbar de la tienda: la "barra de marca" de Admin se mantiene negra en ambos temas, mientras que el sidebar y la card principal (`bg-surface`) sí se oscurecen con el resto.
- El toggle de tema (`ThemeToggle`) no necesitó agregarse a Admin — ya está visible ahí porque el navbar de la tienda se renderiza arriba de todas las páginas, incluido `/admin/*`.

**Verificado visualmente en ambos temas** en `/admin/mangas` (tabla + badges de stock/estado con buen contraste), `/admin/pedidos` (`EstadoBadge` "Procesando" legible), `/admin` (dashboard, los 3 CTA), `/admin/mangas/new` (formulario completo) y la sidebar/toggle. `npx tsc --noEmit` sin errores nuevos.

---

## Progreso

| Fase | Estado |
|------|--------|
| 0 — Tokens | ✅ Hecha (2026-08-30, sin commitear) |
| 1 — Tienda | ✅ Hecha (2026-08-30) — 17/17 archivos |
| 2 — Componentes compartidos | ✅ Hecha (2026-08-30, sin commitear) |
| 3 — Admin | ✅ Hecha (2026-08-30, sin commitear) |
| 4 — Pulido | ✅ Hecha en Admin **y en la tienda** (2026-08-30) |
| 5 — Modo oscuro/claro | ✅ Hecha — tienda y Admin (2026-08-30) |

**Hecho hoy (2026-08-30):** Fase 0, Fase 1, Fase 2, Fase 3 y Fase 4 completas — Admin y tienda. El plan de unificación de diseño está terminado en su totalidad. Los 17 archivos de la tienda migrados a tokens (`bg-cream`, `text-primary`, `bg-ink`, `text-text`/`text-text-secondary`/`text-text-muted`, `border-border`, `bg-surface`, `success`/`danger`/`warning`). `npx tsc --noEmit` no muestra errores nuevos en ninguno de los archivos tocados (los errores existentes en el proyecto son de tests preexistentes y de `.next/dev/types`, sin relación con este trabajo). **Commiteado y pusheado a `main`** (commit `bdb0af0`) para verlo en producción — no se pudo levantar el dev server local porque falta `.env.local` con las credenciales de Supabase (preexistente, no relacionado con este trabajo).

**Nota sobre `MangaDetailClient.tsx`:** es la única página con tema oscuro (fondo casi negro, `neutral-800/900`, grises claros de texto). Ahí solo se tocaron los valores con equivalencia exacta de color (cream, ink, primary, success, danger); los grises/neutros específicos del modo oscuro se dejaron sin tocar a propósito porque los tokens `text-text*` están calibrados para fondo claro y perderían contraste sobre negro. Si más adelante se quiere un tema oscuro real, eso necesita sus propios tokens (fuera del alcance de este plan).

**Nota sobre páginas de `perfil/*`:** estas páginas ya tenían colores mixtos por-función (azul para "editar", verde para "guardar"/gratis, gradientes de 3 colores en el dashboard). Fase 1 solo tocó rojo/crema/grises hacia los tokens nuevos; el azul/verde de esas acciones se dejó igual a propósito — ese tipo de limpieza (badges y acciones semánticas) es trabajo de Fase 2/3, no de Fase 1.

**Pendiente de revisar mañana (visual, en producción ya que local no levanta sin `.env.local`):** home (Hero/Popular/About/SectionMap/Invitation/Footer), navbar (desktop + menú móvil + dropdown de usuario), carrito (panel lateral y `/cart`), detalle de manga (la página de tema oscuro), login/registro, y el layout de `/perfil`. Si algo se ve mal, es más rápido corregirlo ahora que dejarlo arrastrar a Fase 2/3.

**Regla de mapeo usada** (para mantener consistencia en el resto de Fase 1):
- `text-gray-900/800` → `text-text` · `text-gray-700/600` → `text-text-secondary` · `text-gray-500/400` → `text-text-muted`
- `border-gray-100/200/300` → `border-border`
- `bg-white` (cards/dropdowns) → `bg-surface`
- `text-black`/`bg-black` (marca, no UI genérica) → `text-ink`/`bg-ink`
- `bg-[#FFF8F0]`/`text-[#FFF8F0]` → `bg-cream`/`text-cream`
- `red-600` → `primary` · `red-700` (hover) → `primary-hover` · `red-500`/`red-400` → `primary-light`

**Próximo paso concreto:** el plan de unificación de diseño (Fases 0-4, Admin y tienda) está terminado. Lo único que queda deliberadamente fuera es un tema oscuro real para el resto del sitio (hoy solo `MangaDetailClient.tsx` es oscuro) — eso necesitaría sus propios tokens y es un proyecto aparte, no parte de este plan.
