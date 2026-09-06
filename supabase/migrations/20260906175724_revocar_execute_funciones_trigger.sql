-- Las funciones de trigger no deben ser invocables como RPC desde la API.
-- Los triggers siguen funcionando: su ejecucion no depende del permiso EXECUTE.
revoke execute on function public.log_cambio_estado_pedido() from public, anon, authenticated;
revoke execute on function public.proteger_cambio_rol() from public, anon, authenticated;
