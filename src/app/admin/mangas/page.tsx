import { getMangas } from "@/lib/supabase/services/mangas.server";
import { getSeries } from "@/lib/supabase/services/series.server";
import { getCategorias } from '@/lib/supabase/services/categorias.server'
import MangasTable from "@/components/MangasTable";
export default async function Page() {
  const mangas = await getMangas();
  const series = await getSeries();
  const categorias = await getCategorias();
  console.log('Mangas:', mangas);
  console.log('Series:', series);
  console.log('Categorias:', categorias);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2 text-gray-700">Lista de Mangas</p>

      <MangasTable mangas={mangas} series={series} categorias={categorias} />
    </div>
  );
}
