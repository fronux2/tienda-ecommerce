import UploadImgForm from '@/components/UploadImgForm';
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
    return
  }

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('rol_id')
    .eq('id', user.id)
    .single()

  if (!perfil || perfil.rol_id! < 2) {
    redirect('/login')
    return
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Subir imagen de manga</h1>
      <UploadImgForm />
    </main>
  );
}
