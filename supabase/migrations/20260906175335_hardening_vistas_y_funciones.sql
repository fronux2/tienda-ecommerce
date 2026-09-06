-- 1. Las vistas deben respetar el RLS del usuario que consulta, no el de su dueño
alter view public.vista_carrito_activo set (security_invoker = true);
alter view public.vista_detalle_pedidos set (security_invoker = true);

-- 2. search_path fijo (linter: function_search_path_mutable)
alter function public.decrement_stock(uuid, integer) set search_path = public, pg_temp;
alter function public.insert_user_in_public_table_for_new_user() set search_path = public, pg_temp;

-- 3. El trigger de auditoria pasa a SECURITY DEFINER: si no, al activar RLS en log_pedidos
--    el cambio de estado de un pedido fallaria al no poder insertar el registro de log.
alter function public.log_cambio_estado_pedido() security definer set search_path = public, pg_temp;

-- 4. Funciones que no deben ser invocables como RPC publico
revoke execute on function public.insert_user_in_public_table_for_new_user() from public, anon, authenticated;
revoke execute on function public.decrement_stock(uuid, integer) from public, anon, authenticated;
revoke execute on function public.crear_pedido_completo(uuid, uuid, numeric, text, text, jsonb) from public, anon;

-- 5. crear_pedido_completo: validar que el pedido se cree a nombre del propio usuario autenticado
create or replace function public.crear_pedido_completo(
  p_usuario_id uuid,
  p_direccion_id uuid,
  p_total numeric,
  p_token text,
  p_buy_order text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
DECLARE
  v_pedido_id UUID;
  v_item JSONB;
  v_total_calculado NUMERIC;
BEGIN
  IF auth.uid() IS NULL OR p_usuario_id <> auth.uid() THEN
    RAISE EXCEPTION 'No puedes crear un pedido a nombre de otro usuario';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM direcciones d
    WHERE d.id = p_direccion_id AND d.usuario_id = p_usuario_id
  ) THEN
    RAISE EXCEPTION 'La direccion no pertenece al usuario';
  END IF;

  SELECT COALESCE(SUM(m.precio * (elem->>'cantidad')::INT), 0)
  INTO v_total_calculado
  FROM jsonb_array_elements(p_items) AS elem
  JOIN mangas m ON m.id = (elem->>'manga_id')::UUID;

  IF v_total_calculado != p_total THEN
    RAISE EXCEPTION 'El total del pedido no coincide con el total pagado';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    UPDATE mangas
    SET stock = stock - (v_item->>'cantidad')::INT
    WHERE id = (v_item->>'manga_id')::UUID
      AND stock >= (v_item->>'cantidad')::INT;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock insuficiente para manga %', (v_item->>'manga_id');
    END IF;
  END LOOP;

  INSERT INTO pedidos (usuario_id, direccion_id, total, metodo_pago, estado, webpay_token, buy_order)
  VALUES (p_usuario_id, p_direccion_id, p_total, 'webpay', 'procesando', p_token, p_buy_order)
  RETURNING id INTO v_pedido_id;

  INSERT INTO detalle_pedidos (pedido_id, manga_id, cantidad, precio_unitario)
  SELECT v_pedido_id,
         (elem->>'manga_id')::UUID,
         (elem->>'cantidad')::INT,
         m.precio
  FROM jsonb_array_elements(p_items) AS elem
  JOIN mangas m ON m.id = (elem->>'manga_id')::UUID;

  RETURN v_pedido_id;
END;
$function$;

revoke execute on function public.crear_pedido_completo(uuid, uuid, numeric, text, text, jsonb) from public, anon;
grant execute on function public.crear_pedido_completo(uuid, uuid, numeric, text, text, jsonb) to authenticated;
