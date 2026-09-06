-- Escritura en el bucket 'mangas' restringida a staff (rol_id >= 2).
-- La lectura publica de las imagenes no se toca: el bucket es publico y sirve por URL.
drop policy if exists "allow_user_register_all 1h599vj_0" on storage.objects;
drop policy if exists "allow_user_register_all 1h599vj_2" on storage.objects;
drop policy if exists "allow_user_register_all 1h599vj_3" on storage.objects;

create policy "mangas_storage_insert_staff" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'mangas' and public.is_staff());

create policy "mangas_storage_update_staff" on storage.objects
  for update to authenticated
  using (bucket_id = 'mangas' and public.is_staff())
  with check (bucket_id = 'mangas' and public.is_staff());

create policy "mangas_storage_delete_staff" on storage.objects
  for delete to authenticated
  using (bucket_id = 'mangas' and public.is_staff());
