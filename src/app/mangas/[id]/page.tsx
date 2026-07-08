// src/app/mangas/[id]/page.tsx
import { getMangaById } from '@/lib/supabase/services/mangas.server'
import MangaDetailClient from "./MangaDetailsclient"

type ParamsShape = { id: string }

type PageProps = {
  params?: Promise<ParamsShape> | undefined
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | undefined
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const id = String(params?.id ?? "")

  if (!id) {
    return <MangaDetailClient id="" manga={null} />
  }

  const mangas = await getMangaById(id)
  const manga = mangas?.[0] ?? null

  return <MangaDetailClient id={id} manga={manga} />
}
