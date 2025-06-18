
import { create } from 'zustand'
import { getMangas, getMangasPopulares } from '@/lib/supabase/services/mangas.client'
import { type Manga } from '@/types/supabase'

type MangaStore = {
  mangas: Manga[]
  setMangas: (mangas: Manga[]) => void
  addMangas: (mangas: Manga[]) => void
  loadMangasPopulares: () => Promise<void>
  loadMangas: () => Promise<void>
}

export const useMangaStore = create<MangaStore>((set, get) => ({
  mangas: [],

  setMangas: (mangas) => set({ mangas }),

  addMangas: (nuevos) => {
    const actuales = get().mangas
    const nuevosSinDuplicados = nuevos.filter( 
      (manga) => !actuales.some((m) => m.id === manga.id)
    )
    set({ mangas: [...actuales, ...nuevosSinDuplicados] })
  },

  loadMangasPopulares: async () => {
    const populares = await getMangasPopulares()
    get().addMangas(populares)
  },

  loadMangas: async () => {
    const todos = await getMangas()
    get().addMangas(todos)
  },

}))