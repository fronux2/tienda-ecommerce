# Mejoras de Diseño — MangaNihon

> Checklist vivo de la auditoría de `/interface-design` sobre el sitio ya unificado (tokens + Button/Badge + modo oscuro/claro, ver `QUE DEBO HACER.MD`). Se va marcando a medida que se implementa cada ítem.

## Origen

Auditoría pedida por el usuario el 2026-08-30: "qué te parece mi web, hay algo que mejorarías". Se revisó el sitio real en el navegador, en ambos temas: home, catálogo, detalle de manga, carrito, Admin. Conclusión general: el sistema de tokens es consistente, pero debajo hay defaults de e-commerce que nunca se *decidieron* — la marca (crema/tinta/rojo hinomaru) está en la paleta pero no en la estructura.

## Checklist

- [x] **Detalle de manga (`MangaDetailClient.tsx`) roto respecto al modo oscuro real.** Migrado del tema oscuro hardcodeado (`bg-neutral-800/900`, `text-gray-*`, `shadow-red-900/20`) a los tokens adaptativos normales (`bg-cream`, `text-text*`, `bg-surface`, `border-border`). Ahora responde de verdad al toggle en ambos sentidos — verificado en el navegador. El chip de idioma pasó a usar el componente `Badge` (`variant="neutral"`).
- [x] **Card de filtros en `/mangas` le gana visualmente a los productos.** `ListMangas.tsx`: `border-2 border-primary` → `border border-border` + `bg-surface` (antes `bg-cream`, igual al fondo de página — sin esa superficie no había elevación real) + `shadow-sm`. El acento rojo se quedó solo en el subrayado del título, no en todo el borde.
- [x] **Los 3 botones del dashboard de Admin son el mismo botón repetido.** `admin/page.tsx`: rediseñados como "acciones rápidas" con jerarquía real — Manga es la acción primaria (rojo sólido, ícono `FaBook`, subtítulo), Serie y Usuario pasan a secundario (`bg-surface` + borde, íconos `FaListAlt`/`FaUserPlus`, mismo lenguaje de íconos que ya usa el sidebar de Admin). Cada card ahora dice qué hace, no solo qué crea.
- [x] **Grilla de `MangaCard` intercambiable con cualquier tienda genérica.** Se agregó un sello circular tipo hanko (`bg-ink text-cream`, borde `border-cream`) con el número de volumen superpuesto en la esquina inferior izquierda de la portada — visible y legible en ambos temas. Se agregó indicador de stock bajo ("¡Solo N unidades disponibles!" en `text-warning`) cuando `stock` está entre 1 y 5. Ambos props (`volumen`, `stock`) son opcionales y ya se pasan desde `ListMangas.tsx` y `Popular.tsx`.
- [x] **Hero de home es la estructura de landing más default que existe.** `Hero.tsx` reestructurado: franja roja tipo "obi" (la faja de papel de los tomos japoneses) en el borde superior de la sección, kicker "IMPORTADO DIRECTO DE JAPÓN" con acento cuadrado antes del titular (reemplaza el genérico "Bienvenido a"), titular en dos líneas tipo wordmark (`Manga` en tinta / `Nihon` en rojo, tracking ajustado), y un sello circular "MN" estilo hanko superpuesto en la esquina de la imagen del librero — mismo motivo que el sello de volumen de `MangaCard`, coherencia entre componentes.

**Bug encontrado de paso (no listado originalmente):** el navbar fijo mide 72px reales pero el espaciador debajo medía solo 64px (`h-16`) — el navbar tapaba los primeros 8px del contenido de cada página. Se notó porque la franja "obi" del Hero quedaba invisible. Corregido en `NavbarClient.tsx` (`h-16` → `h-[72px]`).

`npx tsc --noEmit` sin errores nuevos en todo el proceso. Verificado visualmente en ambos temas: home (Hero completo), `/mangas` (filtros + grilla con sellos de volumen), detalle de manga (ambos temas, el fix clave), y `/admin` (dashboard, ambos temas).

## Progreso

| # | Ítem | Estado |
|---|------|--------|
| 1 | Detalle de manga vs. modo oscuro | ✅ Hecha |
| 2 | Card de filtros en `/mangas` | ✅ Hecha |
| 3 | Botones del dashboard de Admin | ✅ Hecha |
| 4 | Grilla de `MangaCard` | ✅ Hecha |
| 5 | Hero de home | ✅ Hecha |
