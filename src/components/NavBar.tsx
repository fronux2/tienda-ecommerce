// app/layout.tsx o en app/components/Navbar.tsx (si es server component)

import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { getRolUsuario } from '@/lib/supabase/services/usuarios'

export async function Navbar() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const id = await getRolUsuario(user?.id || '')
  console.log('ID del rol del usuario:', id)
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/">Home</Link>
      {user && (
        <>
          <form action="/logout" method="post">
            <button type="submit">Logout</button>
          </form>
          {id === 2 && <Link href="/admin">Admin</Link>}
          {id === 1 && <Link href="/admin">Normal</Link>}          
        </>
      )}
      {!user && <a href="/login">Login</a>}
      
    </nav>
  )
}
