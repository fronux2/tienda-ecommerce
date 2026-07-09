import UsuariosTable from "@/components/UsuariosTable";
import { Suspense } from "react";
import Loading from "@/components/Loading";
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

  return(
    <Suspense fallback={<Loading />}>
      <UsuariosTable usuarioRolId={perfil.rol_id} />
    </Suspense>
    
  )
}
