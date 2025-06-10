import SeriesTable from "@/components/SeriesTable";
import { getSeriesClient } from "@/lib/supabase/services/series.client";

export default async function SerieDataTable() {
  const series = await getSeriesClient();
    return (
      <div className="p-4">
        <h2 className="mb-2 text-gray-700 text-2xl font-bold">Lista de Serie</h2>
        <SeriesTable series={series} />
      </div>
    );}