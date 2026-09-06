# Tienda Ecommerce de Mangas

Aplicación web construida con Next.js para gestionar una tienda de mangas: catálogo, administración de productos y series, gestión de usuarios y seguimiento de pedidos.

## Dominio de negocio

Este proyecto está enfocado en una **tienda de mangas** con dos grandes áreas:

- **Experiencia pública**: navegación del catálogo y flujos de compra para clientes.
- **Backoffice administrativo**: mantenimiento de mangas, categorías, series, usuarios y pedidos.

La autenticación y el control de permisos se realizan con Supabase, permitiendo diferenciar entre usuarios normales y administrativos.

## Arquitectura (rutas y módulos clave)

- `src/app/admin`
  - Rutas del panel de administración (`/admin` y subrutas como `/admin/mangas`, `/admin/series`, `/admin/categorias`, `/admin/usuarios`, `/admin/pedidos`).
  - Incluye validación de rol para restringir el acceso a usuarios autorizados.

- `src/lib/supabase/services`
  - Servicios de acceso a datos con Supabase.
  - Separación por contexto de ejecución:
    - `*.server.ts`: lógica para Server Components / contexto servidor.
    - `*.client.ts`: lógica usada desde componentes cliente.

- `src/store`
  - Estado global del frontend (Zustand).
  - Útil para manejar estado de sesión/usuario y estados compartidos de UI.

## Variables de entorno

Configura estas variables en tu `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> `SUPABASE_SERVICE_ROLE_KEY` **bypasea todo el Row Level Security**. Solo se usa en el servidor (`src/utils/supabase/admin.ts`) y únicamente para la Admin API de Auth. Nunca la expongas con prefijo `NEXT_PUBLIC_`. Sin ella, `next build` falla al recolectar `/api/crear-usuario`.

### Contexto de uso

- `NEXT_PUBLIC_SUPABASE_URL`
  - URL del proyecto de Supabase.
  - Se usa tanto en cliente como en servidor para inicializar el SDK.
  - Al tener prefijo `NEXT_PUBLIC_`, puede exponerse al frontend.

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Clave pública (anónima) de Supabase.
  - Se usa en cliente/servidor para operaciones permitidas por RLS.
  - Es pública por diseño (siempre protegida por políticas RLS adecuadas).

- `SUPABASE_SERVICE_ROLE_KEY`
  - Clave con privilegios elevados para operaciones administrativas.
  - **Uso exclusivo en backend** (por ejemplo, rutas API del servidor).
  - **Nunca** debe exponerse en componentes cliente ni enviarse al navegador.

## Desarrollo local

### Prerrequisitos

- Node.js 20+ recomendado.
- npm (incluido con Node.js).
- Proyecto/configuración de Supabase con las variables de entorno anteriores.

### Instalación

```bash
npm install
```

### Comandos disponibles

- Desarrollo:

```bash
npm run dev
```

- Build de producción:

```bash
npm run build
```

- Lint:

```bash
npm run lint
```

- Tests:

```bash
npm run test
```

## Permisos y roles

El sistema utiliza `rol_id` (tabla `roles`) para controlar acceso:

| `rol_id` | Rol | Acceso |
|---|---|---|
| 1 | cliente | Tienda, su carrito, sus pedidos y sus direcciones |
| 2 | moderador | Todo lo anterior + panel de administración |
| 3 | admin | Todo lo anterior + puede cambiar roles y editar a otros admins |

El panel exige **`rol_id >= 2`**, no `=== 2`.

Esto se aplica en dos capas, y las dos importan:

1. **En la app**: cada página bajo `/admin` verifica el rol y redirige a `/login` si no cumple.
2. **En la base de datos**: todas las tablas tienen Row Level Security. Aunque alguien se salte la interfaz y llame directo a la API de Supabase con la anon key, solo verá lo suyo. Ver la sección de RLS en `AGENTS.md`.

La verificación de la app por sí sola no es seguridad: protege la pantalla, no los datos.

### Rutas administrativas esperadas

- `/admin`
- `/admin/mangas`
- `/admin/series`
- `/admin/categorias`
- `/admin/usuarios`
- `/admin/pedidos`

Comportamiento esperado:

- Si el usuario autenticado tiene `rol_id === 2`, la app muestra y habilita el panel admin.
- Si no cumple ese rol, la app evita el acceso al backoffice y devuelve al flujo permitido para su perfil.
