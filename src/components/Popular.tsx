import Card1 from "./Card1"
import { getTopMangas } from "@/lib/supabase/services/mangas.server";
import { Manga } from "@/types/supabase";
export default async function Popular() {
    const mangas: Manga[] = await getTopMangas(4);
    return (
        <div className="grid justify-center items-center lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 lg:p-16 md:p-6 sm:p-4 py-20">
            {mangas.map(manga => (
                <Card1
                    key={manga.id}
                    id={manga.id}
                    imagen={manga.imagen_portada}
                    titulo={manga.titulo}
                    autor={manga.autor}
                    editorial={manga.editorial}
                    precio={manga.precio}                    
                />
            ))}
        </div>
    )}