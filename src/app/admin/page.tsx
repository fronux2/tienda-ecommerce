import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FaBook, FaListAlt, FaUserPlus } from 'react-icons/fa'

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
      <h1 className="text-3xl font-bold mb-1 text-text">Panel de Administración</h1>
      <p className="text-text-secondary mb-8">Acciones rápidas</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Manga — la acción más frecuente, gana el foco */}
        <Link
          href="/admin/mangas/new"
          className="group bg-primary hover:bg-primary-hover text-white rounded-lg shadow-md transition-all duration-300 active:scale-[0.98] flex items-center gap-4 p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
        >
          <span className="shrink-0 w-11 h-11 rounded-full bg-white/15 flex items-center justify-center">
            <FaBook size={18} />
          </span>
          <span className="flex flex-col">
            <span className="font-semibold">Crear Nuevo Manga</span>
            <span className="text-sm text-white/70">Agregar al catálogo</span>
          </span>
        </Link>

        {/* Serie y Usuario — disponibles, tratamiento secundario */}
        <Link
          href="/admin/series/new"
          className="group bg-surface hover:border-primary border border-border text-text rounded-lg shadow-sm transition-all duration-300 active:scale-[0.98] flex items-center gap-4 p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          <span className="shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <FaListAlt size={18} />
          </span>
          <span className="flex flex-col">
            <span className="font-semibold">Crear Nueva Serie</span>
            <span className="text-sm text-text-muted">Agrupar volúmenes</span>
          </span>
        </Link>

        <Link
          href="/admin/usuarios/new"
          className="group bg-surface hover:border-primary border border-border text-text rounded-lg shadow-sm transition-all duration-300 active:scale-[0.98] flex items-center gap-4 p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
        >
          <span className="shrink-0 w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <FaUserPlus size={18} />
          </span>
          <span className="flex flex-col">
            <span className="font-semibold">Crear Nuevo Usuario</span>
            <span className="text-sm text-text-muted">Staff o cliente</span>
          </span>
        </Link>
      </div>
    </div>
  )
}
