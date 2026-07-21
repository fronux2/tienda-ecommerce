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
10. PedidosTable.tsx — Export renombrado de Page() a PedidosTable().
11. MangaDetailsclient.tsx — Renombrado a MangaDetailClient.tsx (PascalCase + singular).
12. loading-global.tsx — Renombrado a loading.tsx (Next.js Suspense boundary).
13. Directorio /upImg — Renombrado a /subir-imagen (kebab-case).
14. Import alias inconsistente — UploadForm→UploadImgForm en subir-imagen/page.tsx.
15. AGENTS.md actualizado — Referencia a MangaDetailClient.tsx corregida.

🟡 Importante

1. Página de búsqueda (/busqueda) — Solo trae 10 resultados, busca únicamente por título, y los resultados no tienen link al detalle del manga.
2. SEO en producto — MangaDetailClient es un componente cliente; las páginas de producto no tienen metadatos (perjudica SEO).
3. Páginas del footer rotas — /novedades, /ofertas, /faq, /terminos, /contacto no existen.
4. Validación de stock en checkout — No se verifica stock antes de crear el pedido. decrement_stock puede fallar silenciosamente.

🟢 Mejoras

5. Sistema de notificaciones (toast) — Se mezcla alert() con console.error(). No hay un sistema unificado.
6. Perfil de usuario mínimo — Solo email y cambio de contraseña. Sin nombre, teléfono, avatar.
7. Lista de deseos / valoraciones — No existe wishlist ni sistema de reseñas.

🔴 Pendiente refactorización (componentes)

12. LoginForm.tsx — No se importa en ningún lado (login usa formulario inline). Eliminar.
13. CrearSerieForm.tsx — No se importa, archivo vacío. Eliminar.
14. CrearCategoriaForm.tsx — Solo importado en su test (admin usa edición inline). Eliminar componente + test.
15. EditarCategoriaForm.tsx — Solo importado en su test (admin usa edición inline). Eliminar componente + test.
16. cart/actions/cart.ts — addToCartAction() nunca se usa (carrito usa Zustand). Eliminar.
17. actions/categorias.ts — Solo lo importaba CrearCategoriaForm (muerto). Eliminar.
18. MangaDetailClient.tsx — Componente vivo en src/app/ en vez de src/components/. Mover a src/components/.
