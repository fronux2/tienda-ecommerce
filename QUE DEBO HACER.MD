🔴 Crítico (producción)


🟡 Importante
4. Página de búsqueda (/busqueda) — Solo trae 10 resultados, busca únicamente por título, y los resultados no tienen link al detalle del manga.
5. SEO en producto — MangasDetailClient es un componente cliente; las páginas de producto no tienen metadatos (perjudica SEO).
6. Páginas del footer rotas — /novedades, /ofertas, /faq, /terminos, /contacto no existen.
7. Validación de stock en checkout — No se verifica stock antes de crear el pedido. decrement_stock puede fallar silenciosamente.
🟢 Mejoras
 8. Tests — Solo hay 5 archivos de test. Faltan tests para checkout, login, registro, cartStore, direcciones, tablas admin.
 9. Sistema de notificaciones (toast) — Se mezcla alert() con console.error(). No hay un sistema unificado.
10. Perfil de usuario mínimo — Solo email y cambio de contraseña. Sin nombre, teléfono, avatar.
11. Lista de deseos / valoraciones — No existe wishlist ni sistema de reseñas.
12. Typo — crearCategoriaFrorm.tsx tiene una 'r' de más en el nombre.

# Agregado
Página /cart — No existe src/app/cart/page.tsx. Solo se accede al carrito por el panel lateral deslizable.
2. Paginación — /mangas, tablas admin y listado de pedidos cargan todos los registros de una vez. Sin paginación no escala.


https://tienda-ecommerce-id05r6t8h-fronux2s-projects.vercel.app/error

Sorry, something went wrong