import CrearMangaForm from "@/components/forms/CrearMangaForm";
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
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Admin</h1>
      <CrearMangaForm />
    </main>
  );
}
