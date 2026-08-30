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

- [ ] Revisar estados `hover` / `focus` / `disabled` — que todos los inputs/botones los tengan, no solo los que alguien recordó. Parcialmente cubierto de paso (todo lo que se migró a `focus:ring-primary` en esta pasada ya tiene focus state), pero no se hizo una auditoría dedicada de faltantes.
- [ ] Uniformar radios de borde (inputs vs cards vs modales — hoy mezclados: `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl` sin escala definida). Requiere definir una escala de radios primero — no se tocó, sigue abierto.
- [x] Pasada de `text-gray-*` sueltos que no se migraron en fases anteriores — **completa** en `MangasTable.tsx`, `PedidosTable.tsx`, `SeriesTable.tsx`, `CategoriaTable.tsx`, `UsuariosTable.tsx` y los formularios `series/new`/`usuarios/new` (stat boxes, thead/th/tbody, hover de fila, labels, inputs, mensajes de error/éxito, estados vacíos). Todos migrados a `text-text`/`text-text-secondary`/`text-text-muted`, `bg-surface`/`bg-surface-alt`, `border-border`, `focus:ring-primary`, y los boxes de "Total de X" antes en azul/púrpura/índigo ahora usan `bg-primary/10 text-primary` (un solo acento de marca en vez de un color arbitrario por tabla).

**Hecho** (2026-08-30): `npx tsc --noEmit` sin errores nuevos fuera de `__tests__`. Verificado visualmente en `/admin/mangas`, `/admin/pedidos`, `/admin/series`, `/admin/usuarios`, `/admin/categorias`. Commiteado junto con Fase 2+3.

---

## Progreso

| Fase | Estado |
|------|--------|
| 0 — Tokens | ✅ Hecha (2026-08-30, sin commitear) |
| 1 — Tienda | ✅ Hecha (2026-08-30) — 17/17 archivos |
| 2 — Componentes compartidos | ✅ Hecha (2026-08-30, sin commitear) |
| 3 — Admin | ✅ Hecha (2026-08-30, sin commitear) |
| 4 — Pulido | 🟡 Parcial (2026-08-30) — falta escala de radios y auditoría de hover/focus/disabled |

**Hecho hoy (2026-08-30):** Fase 0, Fase 1, Fase 2 y Fase 3 completas; Fase 4 parcial (la pasada de `text-gray-*` está lista, quedan pendientes los otros dos ítems de pulido). Los 17 archivos de la tienda migrados a tokens (`bg-cream`, `text-primary`, `bg-ink`, `text-text`/`text-text-secondary`/`text-text-muted`, `border-border`, `bg-surface`, `success`/`danger`/`warning`). `npx tsc --noEmit` no muestra errores nuevos en ninguno de los archivos tocados (los errores existentes en el proyecto son de tests preexistentes y de `.next/dev/types`, sin relación con este trabajo). **Commiteado y pusheado a `main`** (commit `bdb0af0`) para verlo en producción — no se pudo levantar el dev server local porque falta `.env.local` con las credenciales de Supabase (preexistente, no relacionado con este trabajo).

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

**Próximo paso concreto:** de los dos ítems que quedan de Fase 4 (opcional): (1) definir una escala de radios de borde (hoy mezclados entre `rounded`/`rounded-md`/`rounded-lg`/`rounded-xl` sin criterio) y aplicarla; (2) auditoría dedicada de estados `hover`/`focus`/`disabled` faltantes en inputs/botones no cubiertos por las migraciones mecánicas de hoy.
