import SerieDataTable from "@/components/SerieDataTable";
import Loading from "@/components/Loading";
import { Suspense } from "react";
export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <main className="p-8">
        <SerieDataTable />
      </main>
    </Suspense>
  );
  
}