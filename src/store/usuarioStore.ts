import { create } from 'zustand'
import { getUsuarios as fetchUsuarios } from '@/lib/supabase/services/usuarios.client'

export type Usuario = {
  id: string
  email: string
  rol_id: string
  roles: {
    id: string
    nombre: string
    rol: string
  }
}

export type UsuarioState = {
  usuarios: Usuario[] | null
  getUsuarios: () => Promise<void>
  updateUsuarioEnStore: (id: string, campo: string, valor: string, rolesMap?: Record<string, string>) => void
}

export const useUsuarioStore = create<UsuarioState>((set) => ({
  usuarios: null,
  getUsuarios: async () => {
    const usuarios: Usuario[] = await fetchUsuarios()
    set({ usuarios })
  },
  updateUsuarioEnStore: (id, campo, valor, rolesMap) => {
    set((state) => ({
      usuarios: state.usuarios?.map((u) => {
        if (u.id !== id) return u

        if (campo === "rol_id") {
          return {
            ...u,
            rol_id: valor,
            roles: {
              ...u.roles,
              id: valor,
              nombre: rolesMap?.[valor] || u.roles.nombre
            }
          }
        }

        return { ...u, [campo]: valor }
      }) || null
    }))
  }
}))
