// src/app/mangas/[id]/page.tsx
import MangaDetailClient from "./MangaDetailsclient"

type ParamsShape = { id: string }

// Tipamos params y searchParams como promesas opcionales (igual que Next espera)
type PageProps = {
  params?: Promise<ParamsShape> | undefined
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | undefined
}

export default async function Page(props: PageProps) {
  // await resuelve las promesas (y si es undefined, params será undefined)
  const params = await props.params
  //const searchParams = await props.searchParams
  const id = String(params?.id ?? "")

  // Si quieres usar searchParams aquí, ya lo tenés resuelto en `searchParams`.
  return <MangaDetailClient id={id ?? ""}/>
}
