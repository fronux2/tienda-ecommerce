❌ Lo que falta (priorizado)
Crítico para funcionar como e-commerce real
1. Página de confirmación de pedido — En checkout/page.tsx:144 tienes comentado window.location.href = /order-confirmed/${order.id}. El usuario nunca ve que su pedido fue exitoso. Necesitas una ruta /order-confirmed/[id].
2. Historial de pedidos para el usuario — Existe getPedidosPorUsuario en pedidos.ts pero no hay una página donde el usuario pueda ver sus pedidos anteriores. Falta una ruta tipo /mis-pedidos o similar.
3. Pasarela de pago real — Actualmente solo seleccionas "Tarjeta/PayPal/Transferencia" pero no hay integración con Webpay Plus (esencial para Chile), MercadoPago, ni Stripe. Sin esto, no puedes cobrar realmente.
4. Registro de usuarios desde el frontend — En tu QUE DEBO HACER.MD dices que [ ] Registrar usuarios está pendiente. Efectivamente, la ruta /login solo tiene login, no registro. Hay un API /api/crear-usuario pero no hay formulario público de registro.
Muy importante
5. Perfil de usuario — Sin página de perfil donde el usuario vea/edite sus datos, cambie contraseña, administre direcciones guardadas.
6. Filtros avanzados en /mangas — En tu TODO list mentionas filtros por stock, precio, editorial, estado, tipo, género. Solo tienes filtro por categoría y autor.
7. Paginación o infinite scroll — Para catálogos grandes, es necesario. Mencionaste infinite scroll en tu TODO.
Mejoras significativas
 8. Notificaciones por email — Confirmación de pedido, cambio de estado, etc.
 9. Cálculo de costo de envío — No hay lógica para calcular tarifas de despacho.
10. Cupones de descuento — Sin sistema de promociones/códigos descuento.
11. Valoraciones/reseñas de productos — Los usuarios no pueden dejar reseñas en los mangas.
12. SEO en páginas dinámicas — Las páginas de detalle de manga (/mangas/[id]) no tienen metadata dinámica (title, description, og:image).
13. Bug detectado: pedidos.ts:8 usa .eq('user_id', userId) pero el resto del proyecto usa usuario_id. Esa consulta probablemente nunca devuelve datos.