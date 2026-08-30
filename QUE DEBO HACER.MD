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

- [ ] **`Button`**: variantes `primary` / `secondary` / `danger` / `ghost`. Ya existe `LoadingButton` — extenderlo con `variant` en vez de crear otro. Reemplaza el `Button` local duplicado dentro de `NavbarClient.tsx` y los estilos de botón copy-pasteados en login/registro/perfil.
- [ ] **`Badge` / `StatusPill`**: un componente semántico único (`variant="success" | "warning" | "danger" | "info" | "neutral"`) que reemplaza:
  - `components/perfil/EstadoBadge.tsx` (ya es semántico, es el modelo a seguir)
  - el badge-map duplicado dentro de `MangasTable.tsx` (categorías: 40 usos de color)
  - el badge-map duplicado dentro de `PedidosTable.tsx` (24 usos)
  - el badge-map duplicado dentro de `SeriesTable.tsx` (5 usos)

---

## Fase 3 — Admin: aplicar el sistema

Con `Button` y `Badge` ya listos, esto es reemplazar, no rediseñar.

- [ ] `components/MangasTable.tsx` — mayor impacto (40 usos de color, 7+ colores distintos para categorías sin criterio)
- [ ] `components/PedidosTable.tsx` — estados de pedido (24 usos, colores duplicados con distinto criterio que `EstadoBadge`)
- [ ] `components/SeriesTable.tsx`
- [ ] `components/CategoriaTable.tsx` / `CategoriaDataTable.tsx`
- [ ] `components/UsuariosTable.tsx`
- [ ] `components/UploadImgForm.tsx`
- [ ] `app/admin/*` (layout, dashboard, formularios `new`)
- [ ] `components/forms/CrearMangaForm.tsx` (34 usos — el más grande de `components/forms`)

---

## Fase 4 — Pulido final (opcional, cuando las anteriores estén listas)

- [ ] Revisar estados `hover` / `focus` / `disabled` — que todos los inputs/botones los tengan, no solo los que alguien recordó
- [ ] Uniformar radios de borde (inputs vs cards vs modales — hoy mezclados)
- [ ] Pasada de `text-gray-*` sueltos que no se migraron en fases anteriores

---

## Progreso

| Fase | Estado |
|------|--------|
| 0 — Tokens | ✅ Hecha (2026-08-30, sin commitear) |
| 1 — Tienda | ✅ Hecha (2026-08-30) — 17/17 archivos |
| 2 — Componentes compartidos | ⬜ No iniciada — **retomar aquí mañana** |
| 3 — Admin | ⬜ No iniciada |
| 4 — Pulido | ⬜ No iniciada |

**Hecho hoy (2026-08-30):** Fase 0 y Fase 1 completas. Los 17 archivos de la tienda migrados a tokens (`bg-cream`, `text-primary`, `bg-ink`, `text-text`/`text-text-secondary`/`text-text-muted`, `border-border`, `bg-surface`, `success`/`danger`/`warning`). `npx tsc --noEmit` no muestra errores nuevos en ninguno de los archivos tocados (los errores existentes en el proyecto son de tests preexistentes y de `.next/dev/types`, sin relación con este trabajo). **Nada de esto está commiteado todavía** — falta decidir cuándo commitear (ver nota abajo).

**Nota sobre `MangaDetailClient.tsx`:** es la única página con tema oscuro (fondo casi negro, `neutral-800/900`, grises claros de texto). Ahí solo se tocaron los valores con equivalencia exacta de color (cream, ink, primary, success, danger); los grises/neutros específicos del modo oscuro se dejaron sin tocar a propósito porque los tokens `text-text*` están calibrados para fondo claro y perderían contraste sobre negro. Si más adelante se quiere un tema oscuro real, eso necesita sus propios tokens (fuera del alcance de este plan).

**Nota sobre páginas de `perfil/*`:** estas páginas ya tenían colores mixtos por-función (azul para "editar", verde para "guardar"/gratis, gradientes de 3 colores en el dashboard). Fase 1 solo tocó rojo/crema/grises hacia los tokens nuevos; el azul/verde de esas acciones se dejó igual a propósito — ese tipo de limpieza (badges y acciones semánticas) es trabajo de Fase 2/3, no de Fase 1.

**Pendiente de revisar antes de commitear:** todavía no se ha visto el sitio corriendo en el navegador con estos cambios. Antes de hacer commit, correr `npm run dev` y revisar visualmente al menos: home (Hero/Popular/About/SectionMap/Invitation/Footer), navbar (desktop + menú móvil + dropdown de usuario), carrito (panel lateral y `/cart`), detalle de manga (la página de tema oscuro), login/registro, y el layout de `/perfil`.

**Regla de mapeo usada** (para mantener consistencia en el resto de Fase 1):
- `text-gray-900/800` → `text-text` · `text-gray-700/600` → `text-text-secondary` · `text-gray-500/400` → `text-text-muted`
- `border-gray-100/200/300` → `border-border`
- `bg-white` (cards/dropdowns) → `bg-surface`
- `text-black`/`bg-black` (marca, no UI genérica) → `text-ink`/`bg-ink`
- `bg-[#FFF8F0]`/`text-[#FFF8F0]` → `bg-cream`/`text-cream`
- `red-600` → `primary` · `red-700` (hover) → `primary-hover` · `red-500`/`red-400` → `primary-light`

**Próximo paso concreto:** revisar visualmente los cambios de Fase 1 (ver checklist de arriba), y si todo se ve bien, commitear Fase 0 + Fase 1 juntas. Después seguir con Fase 2: crear el componente `Badge`/`StatusPill` semántico y extender `LoadingButton` con variantes (`primary`/`secondary`/`danger`/`ghost`) — ver detalle en la sección "Fase 2" más abajo.
