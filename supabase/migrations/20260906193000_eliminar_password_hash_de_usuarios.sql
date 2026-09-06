-- Columna muerta de antes de migrar a Supabase Auth: las contrasenas viven en
-- auth.users (bcrypt, gestionadas por Auth). Estaba NULL en todas las filas y
-- ningun punto del codigo la lee ni la escribe.
alter table public.usuarios drop column password_hash;
