import SeriesTable from "@/components/SeriesTable";
import { getSeriesClient } from "@/lib/supabase/services/series.client";
export default async function Page() {
    const series = await getSeriesClient();
    console.log('Series:', series);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2 text-gray-700">Lista de Serie</p>

      <SeriesTable series={series} />
    </div>
  );
}