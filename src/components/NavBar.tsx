// app/components/Navbar.tsx (server)
import { createClient } from '@/utils/supabase/server'
import { getRolUsuario } from '@/lib/supabase/services/usuarios.server'
import NavbarClient from '@/components/NavbarClient'

export async function Navbar() {
 const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const rolId = await getRolUsuario(user?.id || '')

  return <NavbarClient user={user} rolId={rolId} />
}
