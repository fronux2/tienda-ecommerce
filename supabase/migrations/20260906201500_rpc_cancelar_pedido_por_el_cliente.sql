-- Permite que un cliente cancele su propio pedido mientras no haya sido enviado.
-- Va como RPC y no como politica de UPDATE porque hay que validar tres cosas a
-- la vez (dueno, estado y reposicion de stock) de forma atomica; la politica
-- pedidos_update_staff sigue siendo la unica via para que el staff toque pedidos.
--
-- No devuelve dinero: el reembolso de Webpay se gestiona a mano.
create or replace function public.cancelar_pedido(p_pedido_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $function$
DECLARE
  v_usuario_id UUID;
  v_estado TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesion';
  END IF;

  SELECT usuario_id, estado INTO v_usuario_id, v_estado
  FROM pedidos
  WHERE id = p_pedido_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El pedido no existe';
  END IF;

  IF v_usuario_id <> auth.uid() THEN
    RAISE EXCEPTION 'No puedes cancelar un pedido de otra persona';
  END IF;

  IF v_estado NOT IN ('pendiente', 'procesando') THEN
    RAISE EXCEPTION 'Este pedido ya no se puede cancelar';
  END IF;

  -- Devolver al catalogo el stock que descontó crear_pedido_completo
  UPDATE mangas m
  SET stock = m.stock + d.cantidad
  FROM detalle_pedidos d
  WHERE d.pedido_id = p_pedido_id
    AND m.id = d.manga_id;

  -- El trigger tr_log_pedidos_update deja el registro en log_pedidos
  UPDATE pedidos
  SET estado = 'cancelado',
      fecha_actualizacion = CURRENT_TIMESTAMP
  WHERE id = p_pedido_id;
END;
$function$;

revoke execute on function public.cancelar_pedido(uuid) from public, anon;
grant execute on function public.cancelar_pedido(uuid) to authenticated;
