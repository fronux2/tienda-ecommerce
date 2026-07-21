import SeriesTable from "@/components/SeriesTable";
import { getSeries } from "@/lib/supabase/services/series.server";

export default async function SerieDataTable() {
  const series = await getSeries();
    return (
      <div className="p-4">
        <SeriesTable series={series} />
      </div>
    );}