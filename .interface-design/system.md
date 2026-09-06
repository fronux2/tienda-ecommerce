# Sistema de interfaz — MangaNihon

Tienda de manga. Todo lo de abajo está extraído del código real (`src/app/globals.css`
y los componentes existentes), no inventado. Si vas a construir UI acá, respétalo:
cada valor nuevo que no salga de esta lista es deuda visual.

## Dirección y sensación

**Papel de manga, tinta sumi y rojo hinomaru.** Superficies color papel crema, trazos
de tinta negra gruesos como bordes de panel, y un único acento rojo. Se lee como un
tomo impreso, no como un dashboard SaaS genérico. Nada de gradientes decorativos,
nada de una segunda familia de acentos.

## Tokens

Definidos en `@theme` en `src/app/globals.css`. **Nunca uses hex sueltos ni escalas
crudas de Tailwind (`gray-500`, `bg-white`)** — todo pasa por estos tokens, que son
los que hacen funcionar el modo oscuro.

| Grupo | Tokens |
|---|---|
| Marca | `primary` `#dc2626` · `primary-hover` · `primary-light` |
| Superficies de marca | `cream` (papel) · `ink` (tinta) |
| Chrome | `chrome` · `chrome-foreground` |
| Neutras | `surface` · `surface-alt` |
| Texto | `text` · `text-secondary` · `text-muted` |
| Bordes | `border` |
| Semánticos | `success` · `warning` · `danger` · `info` |

**Dos reglas que ya están decididas y no hay que re-litigar:**

1. **`primary` y `chrome` NO cambian con el tema.** El rojo de marca y la barra negra
   (navbar, footer, fondo del panel admin) son constantes en claro y oscuro. El modo
   oscuro solo redefine superficies y texto. Está así a propósito.
2. **`primary` es acción de marca; `danger`/`success` son estado.** Comparten el
   mismo rojo por casualidad — no los intercambies. Un botón destructivo no es
   `primary`, y un error no es "el rojo de la marca".

Modo oscuro: se activa con la clase `.dark` en `<html>` (ver `ThemeToggle.tsx`).

## Profundidad

**Bordes primero, sombra casi nunca.** La estructura se construye con trazos, no con
elevación:

- `border-2 border-ink` — énfasis, contenedor protagonista de la vista (el trazo de panel).
- `border-2 border-border` — inputs y contenedores secundarios.
- `border` (1px) — separaciones sutiles, chips, celdas.

La sombra fuerte (`shadow-2xl`) se reserva para **la tarjeta principal de una vista**
(ej. la tarjeta de login/registro). No la repartas por cada card.

## Radios

Escala real en uso, de menor a mayor:

| Radio | Uso |
|---|---|
| `rounded-[2px]` | celdas del medidor de contraseña |
| `rounded-md` (6px) | chips, sellos, controles pequeños |
| `rounded-lg` (8px) | inputs y botones (el más usado, 98 ocurrencias) |
| `rounded-xl` (12px) | tarjetas y contenedores principales |
| `rounded-full` | píldoras, avatares, badges de contador |

Radio concéntrico: si anidas, `radio exterior = radio interior + padding`.

## Espaciado

Base 4px, solo múltiplos. Valores que ya se repiten y hay que reusar:

- Botones: `px-6 py-3` (primarios), `px-4 py-2` (secundarios/compactos)
- Cards: `p-4`
- Formularios: `px-6 py-8 md:px-8 md:py-10`
- Inputs: `p-3`, con `pl-10` cuando llevan ícono a la izquierda
- Gaps de chips/elementos en fila: `gap-1` a `gap-1.5`

## Movimiento

- Duración **150ms** para cambios de estado; nunca sobre 300ms en UI.
- Curva `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out real, no la de la librería).
- Solo `transform`, `opacity` y color. Nunca `transition: all`.
- Siempre `motion-reduce:transition-none`.
- Las transiciones de página usan View Transitions (`::view-transition-*` en globals.css).

## Patrones de componente

**Input de formulario**
`w-full p-3 pl-10 bg-cream border-2 border-border text-ink rounded-lg` +
`focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary` +
`placeholder-text-muted`. Ícono en `absolute left-3 top-1/2 -translate-y-1/2 text-primary`.

**Botón primario**
`bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg shadow-md`
+ `focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2`.

**Tarjeta de vista (login/registro)**
`bg-surface rounded-xl border-2 border-ink shadow-2xl max-w-md overflow-hidden`, con
cabecera `bg-primary py-6 border-b-2 border-ink` y título blanco.

**Indicador de requisitos de contraseña** (`src/components/PasswordRequisitos.tsx`)
- Medidor: 10 celdas `h-2 flex-1 rounded-[2px]`, `gap-1`. Una celda por caracter
  exigido — se pueden **contar** las que faltan, que es justamente lo que una barra
  con gradiente no comunica. Llenas: `bg-ink`; todo cumplido: `bg-success`;
  vacías: `border-ink/25`.
- Sellos: `rounded-md border px-2 py-1 text-xs font-medium`, ícono de 12px + etiqueta.
- Estado: línea concreta (`Te faltan 4 caracteres`, `Falta: símbolo`,
  `Contraseña lista`), nunca una etiqueta arbitraria tipo "Fortaleza: media".

**Coincidencia de contraseñas** (`src/components/PasswordCoincidencia.tsx`)
Tres estados, no dos. El binario coincide/no-coincide pinta rojo casi todo el rato
mientras alguien escribe correctamente:
- Iguales → `text-success`, "Las contraseñas coinciden".
- Lo escrito es prefijo de la contraseña → `text-text-muted`, "Sigue escribiendo".
  Todavía puede terminar bien: no hay error que señalar.
- Ya divergieron → `text-danger`, "Las contraseñas no coinciden".

**Iconos y transiciones compartidos**
`src/components/icons/estado.tsx` (`IconoCumple`, `IconoPendiente`, `IconoError`, 12px)
y `src/lib/ui/transiciones.ts` (`TRANSICION_ESTADO`). Úsalos en vez de redefinir el
SVG o la cadena de transición en cada componente.

## Reglas de criterio (las que se rompen sin darse cuenta)

- **Nunca color solo.** Todo estado que se comunique con rojo/verde lleva además
  ícono o texto. Hay gente que no distingue esos dos colores.
- **No marcar en rojo lo que el usuario todavía no escribió.** Los estados de error
  arrancan neutros y se activan cuando ya hay input.
- **`tabular-nums` en todo número que cambia** (contadores, precios, totales), para
  que no bailen los anchos.
- **Un foco por vista.** Si todo pesa igual, nada guía la vista.
- **Jerarquía con peso y color antes que con tamaño.** Tres niveles en 14px con
  `font-medium`/`text-secondary`/`text-muted` separan mejor que tres tamaños casi iguales.
