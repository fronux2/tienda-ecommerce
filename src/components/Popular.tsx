import Card1 from "./Card1"
import { getTopMangas } from "@/lib/supabase/services/mangas.server";
import { Manga } from "@/types/supabase";
export default async function Popular() {
    const mangas: Manga[] = await getTopMangas(4);
    return (
        <div className="flex justify-center gap-4 p-6 bg-gray-100">
            {mangas.map(manga => (
                <Card1
                    key={manga.id}
                    imagen={manga.imagen_portada}
                    titulo={manga.titulo}
                    autor={manga.autor}
                    editorial={manga.editorial}
                    precio={manga.precio}
                />
            ))}
        </div>
    )}