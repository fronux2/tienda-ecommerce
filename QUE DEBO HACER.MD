✅ Completado

1. Página /cart — Creada en src/app/cart/page.tsx con vista completa, cantidades, subtotal, sidebar.
2. Paginación — ListMangas.tsx implementa "Cargar más" (12 items/página). Admin tablas muestran todos.
3. Typo crearCategoriaFrorm.tsx — Renombrado a CrearCategoriaForm.tsx (PascalCase + typo corregido).
4. Renombrado de componentes — NavBar→Navbar, editarCategoriaForm→EditarCategoriaForm, uploadImgForm→UploadImgForm.
5. Dead code eliminado — PopularUser.tsx, WithUser.tsx eliminados (no se importaban en ningún lado).
6. Tests — 19 suites, 185 tests (era 5 archivos al inicio).
7. Error #185 (loop infinito) — Fix: selectores individuales en Cart, AddToCartButton + deps estables en NavbarClient.
8. Case-sensitivity Linux — UploadImgForm.tsx renombrado correctamente para Vercel (Linux).
9. MapComponent.tsx restaurado — Necesario para /direccion (dynamic import).

🟡 Importante

1. Página de búsqueda (/busqueda) — Solo trae 10 resultados, busca únicamente por título, y los resultados no tienen link al detalle del manga.
2. SEO en producto — MangasDetailClient es un componente cliente; las páginas de producto no tienen metadatos (perjudica SEO).
3. Páginas del footer rotas — /novedades, /ofertas, /faq, /terminos, /contacto no existen.
4. Validación de stock en checkout — No se verifica stock antes de crear el pedido. decrement_stock puede fallar silenciosamente.

🟢 Mejoras

5. Sistema de notificaciones (toast) — Se mezcla alert() con console.error(). No hay un sistema unificado.
6. Perfil de usuario mínimo — Solo email y cambio de contraseña. Sin nombre, teléfono, avatar.
7. Lista de deseos / valoraciones — No existe wishlist ni sistema de reseñas.

🔴 Pendiente refactorización (nombres)

8. MangaDetailsclient.tsx — "client" en minúscula + "Details" plural vs export "Detail" singular. Renombrar a MangaDetailClient.tsx.
9. PedidosTable.tsx — Export dice Page() en vez de PedidosTable(). Renombrar el export.
10. loading-global.tsx — Nombre kebab-case, archivo no importado en ningún lado. Renombrar a LoadingGlobal.tsx o eliminar.
11. Directorio /upImg — Usa camelCase en vez de kebab-case (convención de rutas Next.js).
