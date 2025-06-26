import { getMangas } from "@/lib/supabase/services/mangas.server";
import { getSeries } from "@/lib/supabase/services/series.server";
import { getCategorias } from '@/lib/supabase/services/categorias.server'
import MangasTable from "@/components/MangasTable";

export default async function MangaDataLoader() {
  const mangas = await getMangas();
  const series = await getSeries();
  const categorias = await getCategorias();
  return (
    <div className="p-4">
      <MangasTable mangas={mangas} series={series} categorias={categorias} />
    </div>
  );
}