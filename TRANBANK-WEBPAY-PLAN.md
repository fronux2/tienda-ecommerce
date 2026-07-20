# Plan de integración: Transbank Webpay Plus

## ¿Cómo funciona Webpay Plus?

A diferencia de Stripe (formulario embebido), Webpay Plus es un flujo de **redirección**:

```
Tu checkout  →  (1) Crear transacción  →  Transbank devuelve { token, url }
                              │
                              ▼
            (2) Rediriges al usuario a Transbank
                (POST con token_ws)
                              │
                              ▼
            (3) Usuario llena tarjeta en página SEGURA de Transbank
                              │
                              ▼
            (4) Transbank redirige de vuelta a tu sitio
                              │
                              ▼
            (5) Confirmas (commit) la transacción
                              │
                              ▼
            (6) Si éxito → creas pedido en Supabase
                Si falla → muestras error
```

---

## Paso 1 — Lo que debes hacer tú (afuera del código)

**No necesitas registrarte ni obtener credenciales** para el ambiente de integración. El SDK ya trae las credenciales de prueba preconfiguradas.

Solo ejecuta:

```bash
npm install transbank-sdk
```

Eso es todo. El ambiente de integración de Transbank está disponible 24/7 sin costo.

---

## Paso 2 — Paquetes a instalar

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `transbank-sdk` | ^6.1.1 | SDK oficial de Transbank para Node.js |

```bash
npm install transbank-sdk
```

Solo 1 dependencia.

---

## Paso 3 — Base de datos (Supabase SQL)

Agregar columnas a la tabla `pedidos` para trackear la transacción Webpay:

```sql
ALTER TABLE pedidos ADD COLUMN webpay_token TEXT;
ALTER TABLE pedidos ADD COLUMN buy_order TEXT;
```

- `webpay_token` — token único que devuelve Transbank al crear la transacción
- `buy_order` — orden de compra única que enviamos a Transbank

---

## Paso 4 — Archivos a crear (código)

| Archivo | Propósito |
|---------|-----------|
| `src/lib/transbank.ts` | Inicializa el SDK de Transbank en modo integración |
| `src/app/api/webpay/create/route.ts` | `POST` — Crea transacción en Transbank, retorna `{ token, url }` |
| `src/app/api/webpay/commit/route.ts` | `POST` — Confirma transacción cuando el usuario vuelve de Transbank |
| `src/app/webpay/resultado/page.tsx` | Página de retorno (`returnUrl`) — recibe el `token_ws`, confirma, crea pedido o muestra error |

### Detalle de cada uno

#### `src/lib/transbank.ts`
- Importa `WebpayPlus`, `Options`, `Environment`, `IntegrationCommerceCodes`, `IntegrationApiKeys` del SDK
- Exporta una función `createTransaction(amount, buyOrder, sessionId, returnUrl)` que crea la transacción
- Exporta una función `commitTransaction(token)` que confirma la transacción
- Usa credenciales de integración (preconfiguradas en el SDK)
- En producción se configurarían credenciales reales desde variables de entorno

#### `src/app/api/webpay/create/route.ts`
- Recibe `{ buyOrder, sessionId, amount, returnUrl }`
- Llama a `createTransaction()` del SDK
- Retorna `{ token, url }` al frontend
- El `buy_order` debe ser único por transacción (ej: `TM-{timestamp}-{userId}`)
- El `returnUrl` apunta a `/webpay/resultado`
- El `sessionId` puede ser el `userId`

#### `src/app/api/webpay/commit/route.ts`
- Recibe `{ token_ws }`
- Llama a `commitTransaction(token_ws)` del SDK
- Retorna el resultado de la transacción (aprobada/rechazada + detalles)

#### `src/app/webpay/resultado/page.tsx`
- **Componente cliente** (necesita `useEffect` para procesar el retorno)
- Lee `token_ws` de la URL (query param)
- Llama a `POST /api/webpay/commit` con el token
- Si la transacción fue **AUTHORIZED**:
  - Obtiene los items del carrito desde `localStorage`
  - Crea el pedido en Supabase (`pedidos` + `detalle_pedidos`)
  - Decrementa stock vía RPC
  - Limpia carrito
  - Envía emails
  - Redirige a `/perfil/pedidos/{id}`
- Si la transacción **falló**:
  - Muestra pantalla de error con botón "Volver al carrito"

---

## Paso 5 — Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `package.json` | Agregar `transbank-sdk` en `dependencies` |
| `src/types/supabase.ts` | Agregar `webpay_token?: string` y `buy_order?: string` al type `Pedido` (línea ~116-128) |
| `src/app/checkout/page.tsx` | **Cambio mayor** — reemplazar el `<select>` de métodos de pago por un botón "Pagar con Webpay" |
| `src/app/perfil/pedidos/[id]/page.tsx` | Mostrar método de pago "Webpay Plus" en vez de "Tarjeta de Crédito" |

### Detalle del cambio en checkout

El `<select>` actual con opciones `tarjeta`, `paypal`, `transferencia` se reemplaza por:

1. Un texto que indica "Webpay Plus — Tarjetas de crédito/débito"
2. Un botón **"Pagar con Webpay"** (verde, estilizado)
3. Al hacer clic:
   - Guarda el carrito actual en `localStorage` (por si el usuario vuelve)
   - Genera un `buyOrder` único: `TM-{Date.now()}`
   - Llama a `POST /api/webpay/create`
   - Con la respuesta `{ token, url }`, hace submit de un formulario POST con `token_ws` hidden a la URL de Transbank
   - El usuario es redirigido a la página de pago de Transbank

No se necesita crear el pedido antes de la redirección (se crea después del commit exitoso).

---

## Paso 6 — Flujo completo paso a paso

```
1. Usuario en /checkout con dirección seleccionada y carrito lleno
   │
2. Click en "Pagar con Webpay ($XX.XXX)"
   │
3. Frontend guarda carrito en localStorage (respaldo)
   │
4. Frontend llama a POST /api/webpay/create
   Body: { amount: total, buyOrder: "TM-1712345678", sessionId: userId, returnUrl: "https://..." }
   │
5. Backend (SDK) crea transacción en Transbank (ambiente integración)
   Retorna: { token: "abc123...", url: "https://webpay3gint.transbank.cl/..." }
   │
6. Frontend recibe { token, url } y hace submit automático:
   <form action={url} method="POST">
     <input type="hidden" name="token_ws" value={token} />
   </form>
   │
7. Usuario es redirigido a la página segura de Transbank
   │
8. Usuario ingresa datos de tarjeta de prueba:
   ┌─────────────────────────────────────────┐
   │  Tarjeta:  4051 8856 0044 6623         │
   │  CVV:      123                          │
   │  Fecha:    cualquier fecha futura       │
   │  RUT:      11.111.111-1                 │
   │  Clave:    123                          │
   └─────────────────────────────────────────┘
   │
9. Transbank procesa (aprueba o rechaza según la tarjeta)
   │
10. Transbank redirige al usuario a:
    /webpay/resultado?token_ws=abc123...
    │
11. Página /webpay/resultado:
    a) Lee token_ws de la URL
    b) Llama a POST /api/webpay/commit { token_ws }
    c) Backend confirma (commit) la transacción
    │
    ├── ✅ Si response.status === 'AUTHORIZED'
    │   a) Lee carrito desde localStorage
    │   b) Inserta pedido en Supabase:
    │      - estado: 'procesando' (ya pagó)
    │      - metodo_pago: 'webpay'
    │      - webpay_token: token_ws
    │      - buy_order: "TM-..."
    │   c) Inserta detalle_pedidos
    │   d) Ejecuta decrement_stock para cada item
    │   e) Marca carrito como checked_out
    │   f) Limpia localStorage
    │   g) Envía emails (confirmación + admin)
    │   h) Redirige a /perfil/pedidos/{id}
    │
    └── ❌ Si falla (rechazada, timeout, etc.)
        a) Muestra pantalla de error con:
           - Mensaje: "El pago no pudo ser procesado"
           - Detalle del error (si aplica)
           - Botón "Volver al carrito" → redirige a /cart
```

---

## Tarjetas de prueba

Todas las transacciones en ambiente de integración **no mueven dinero real**.

| Tarjeta | CVV | Expiración | Resultado |
|---------|-----|-----------|-----------|
| `4051 8856 0044 6623` | 123 | Cualquier fecha futura | ✅ Aprobada (VISA) |
| `5186 0595 5959 0568` | 123 | Cualquier fecha futura | ❌ Rechazada (Mastercard) |

Autenticación bancaria (paso extra en el formulario de Transbank):
- **RUT:** `11.111.111-1`
- **Clave:** `123`

---

## Resumen de cambios

```
Nuevos archivos:
├── src/lib/transbank.ts
├── src/app/api/webpay/create/route.ts
├── src/app/api/webpay/commit/route.ts
└── src/app/webpay/resultado/page.tsx

Archivos modificados:
├── package.json              → + transbank-sdk
├── src/types/supabase.ts     → + webpay_token, buy_order
├── src/app/checkout/page.tsx → reemplazar selector pago
└── src/app/perfil/pedidos/[id]/page.tsx → label "Webpay Plus"

Base de datos (Supabase SQL):
ALTER TABLE pedidos ADD COLUMN webpay_token TEXT;
ALTER TABLE pedidos ADD COLUMN buy_order TEXT;
```

---

## Diferencias con Stripe (para que entiendas el cambio de enfoque)

| Stripe | Webpay Plus |
|--------|-------------|
| Formulario de tarjeta embebido en tu página | Redirige a página segura de Transbank |
| `confirmPayment()` client-side | `commit()` server-side |
| Webhook asíncrono para actualizar estado | Todo es síncrono, no necesita webhook |
| El usuario nunca sale de tu sitio | El usuario sale y vuelve |
| Usa `clientSecret` + PaymentElement | Usa `token_ws` + formulario POST |
| Se necesita cuenta Stripe + API keys | SDK trae credenciales de test incorporadas |
| Soporta CLP (Stripe sí está en Chile) | Nativo chileno, soporta CLP y USD |

---

## Notas importantes

- **Buy Order único**: Cada transacción debe tener un `buy_order` único. Usar formato `TM-{timestamp}-{random}` para asegurar unicidad.
- **El carrito viaja en localStorage**: Al ser un flujo con redirección, los items del carrito se guardan en `localStorage` antes de redirigir a Transbank y se recuperan al volver.
- **No hay webhook**: A diferencia de Stripe, Webpay Plus es síncrono. El `commit()` se hace inmediatamente cuando el usuario vuelve. No hay eventos asíncronos.
- **Timeout**: Si el usuario nunca vuelve (cierra la ventana), la transacción queda huérfana. En producción se programa un cron para liberar stock de pedidos huérfanos.
- **Producción**: Para salir a producción necesitas registrarte en Transbank, pasar el proceso de validación, y obtener credenciales reales (`commerceCode` y `apiKey`). El código está preparado para cambiarlas desde `.env`.
- **Diferencia con Stripe (importante)**: Stripe permite crear el pedido después del pago porque el formulario está embebido. Webpay requiere redirigir, así que los items del carrito se persisten en `localStorage` y se recuperan cuando el usuario vuelve de Transbank.
