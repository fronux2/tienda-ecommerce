import SeriesTable from "@/components/SeriesTable";
import { getSeriesClient } from "@/lib/supabase/services/series.client";

export default async function SerieDataTable() {
  const series = await getSeriesClient();
    return (
      <div className="p-4">
        <SeriesTable series={series} />
      </div>
    );}