import CategoriaDataTable from "@/components/CategoriaDataTable";
import Loading from "@/components/Loading";
import { Suspense } from "react";
export default async function CategoriasPage() {
  return (
    <Suspense fallback={<Loading />}>
      <main className="p-8">
        <CategoriaDataTable />
      </main>
    </Suspense>
  );
    
}