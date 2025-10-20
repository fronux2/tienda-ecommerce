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

  if (perfil?.rol_id !== 2) {
    redirect('/login')
    return
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Botón para Mangas */}
        <Link 
          href="/admin/mangas/new"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
        >
          <span>Crear Nuevo Manga</span>
        </Link>
        
        {/* Botón para Series */}
        <Link 
          href="/admin/series/new"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
        >
          <span>Crear Nueva Serie</span>
        </Link>
        
        {/* Botón para Usuarios */}
        <Link 
          href="/admin/usuarios/new"
          className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-4 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
        >
          <span>Crear Nuevo Usuario</span>
        </Link>
      </div>
    </div>
  )
}