import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout() {
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
    <div className="min-h-screen bg-surface-alt p-8">
      <h1 className="text-3xl font-bold mb-8 text-text">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Botón para Mangas */}
        <Link
          href="/admin/mangas/new"
          className="bg-primary hover:bg-primary-hover text-white font-medium py-4 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
        >
          <span>Crear Nuevo Manga</span>
        </Link>

        {/* Botón para Series */}
        <Link
          href="/admin/series/new"
          className="bg-primary hover:bg-primary-hover text-white font-medium py-4 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
        >
          <span>Crear Nueva Serie</span>
        </Link>

        {/* Botón para Usuarios */}
        <Link
          href="/admin/usuarios/new"
          className="bg-primary hover:bg-primary-hover text-white font-medium py-4 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
        >
          <span>Crear Nuevo Usuario</span>
        </Link>
      </div>
    </div>
  )
}