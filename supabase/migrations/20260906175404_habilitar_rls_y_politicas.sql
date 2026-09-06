-- ============================================================
-- Helpers de rol (SECURITY DEFINER para evitar recursion de RLS)
-- ============================================================
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.usuarios u
    where u.id = (select auth.uid()) and u.rol_id >= 2
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.usuarios u
    where u.id = (select auth.uid()) and u.rol_id = 3
  );
$$;

grant execute on function public.is_staff() to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================
-- Anti escalada de privilegios en usuarios
-- ============================================================
create or replace function public.proteger_cambio_rol()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin()
     and (new.rol_id is distinct from old.rol_id or old.rol_id = 3) then
    raise exception 'No tienes permiso para modificar el rol o los datos de un administrador';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_proteger_cambio_rol on public.usuarios;
create trigger trg_proteger_cambio_rol
before update on public.usuarios
for each row execute function public.proteger_cambio_rol();

-- email / password_hash / id los gestiona Supabase Auth, no la API de tablas
revoke update (email, password_hash, id) on public.usuarios from authenticated, anon;

-- ============================================================
-- CATALOGO: mangas, categorias, series, roles
-- ============================================================
alter table public.mangas enable row level security;
create policy "mangas_select_publico" on public.mangas
  for select to anon, authenticated
  using (activo = true or public.is_staff());
create policy "mangas_insert_staff" on public.mangas
  for insert to authenticated
  with check (public.is_staff());
create policy "mangas_update_staff" on public.mangas
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

alter table public.categorias enable row level security;
create policy "categorias_select_publico" on public.categorias
  for select to anon, authenticated using (true);
create policy "categorias_insert_staff" on public.categorias
  for insert to authenticated with check (public.is_staff());
create policy "categorias_update_staff" on public.categorias
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

alter table public.series enable row level security;
create policy "series_select_publico" on public.series
  for select to anon, authenticated using (true);
create policy "series_insert_staff" on public.series
  for insert to authenticated with check (public.is_staff());
create policy "series_update_staff" on public.series
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

alter table public.roles enable row level security;
create policy "roles_select_publico" on public.roles
  for select to anon, authenticated using (true);

-- ============================================================
-- usuarios
-- ============================================================
alter table public.usuarios enable row level security;
create policy "usuarios_select_propio_o_staff" on public.usuarios
  for select to authenticated
  using (id = (select auth.uid()) or public.is_staff());
create policy "usuarios_update_propio_o_staff" on public.usuarios
  for update to authenticated
  using (id = (select auth.uid()) or public.is_staff())
  with check (id = (select auth.uid()) or public.is_staff());

-- ============================================================
-- direcciones
-- ============================================================
alter table public.direcciones enable row level security;
create policy "direcciones_select" on public.direcciones
  for select to authenticated
  using (usuario_id = (select auth.uid()) or public.is_staff());
create policy "direcciones_insert" on public.direcciones
  for insert to authenticated
  with check (usuario_id = (select auth.uid()));
create policy "direcciones_update" on public.direcciones
  for update to authenticated
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));
create policy "direcciones_delete" on public.direcciones
  for delete to authenticated
  using (usuario_id = (select auth.uid()));

-- ============================================================
-- carrito
-- ============================================================
alter table public.carrito enable row level security;
create policy "carrito_select" on public.carrito
  for select to authenticated using (usuario_id = (select auth.uid()));
create policy "carrito_insert" on public.carrito
  for insert to authenticated with check (usuario_id = (select auth.uid()));
create policy "carrito_update" on public.carrito
  for update to authenticated
  using (usuario_id = (select auth.uid()))
  with check (usuario_id = (select auth.uid()));
create policy "carrito_delete" on public.carrito
  for delete to authenticated using (usuario_id = (select auth.uid()));

-- ============================================================
-- pedidos (INSERT solo via crear_pedido_completo)
-- ============================================================
alter table public.pedidos enable row level security;
create policy "pedidos_select" on public.pedidos
  for select to authenticated
  using (usuario_id = (select auth.uid()) or public.is_staff());
create policy "pedidos_update_staff" on public.pedidos
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());
create policy "pedidos_delete_staff" on public.pedidos
  for delete to authenticated using (public.is_staff());

-- ============================================================
-- detalle_pedidos (lectura via join; se llena dentro del RPC)
-- ============================================================
alter table public.detalle_pedidos enable row level security;
create policy "detalle_pedidos_select" on public.detalle_pedidos
  for select to authenticated
  using (
    public.is_staff() or exists (
      select 1 from public.pedidos p
      where p.id = detalle_pedidos.pedido_id
        and p.usuario_id = (select auth.uid())
    )
  );

-- ============================================================
-- log_pedidos (auditoria interna, escribe solo el trigger)
-- ============================================================
alter table public.log_pedidos enable row level security;
create policy "log_pedidos_select_staff" on public.log_pedidos
  for select to authenticated using (public.is_staff());
