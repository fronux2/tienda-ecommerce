import Loading from "@/components/Loading";
import MangaDataLoader from "@/components/MangaDataLoader";
import { Suspense } from "react";
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
  
    if (perfil?.rol_id !== 2) {
      redirect('/login')
      return
    }
  return (
    <Suspense fallback={<Loading />}>
      <main className="p-8">
        <MangaDataLoader />
      </main>
    </Suspense>
  );
}
