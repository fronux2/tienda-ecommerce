import Loading from "@/components/Loading";
import MangaDataLoader from "@/components/MangaDataLoader";
import { Suspense } from "react";
export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <main className="p-8">
        <h1 className="text-xl font-bold mb-4">Panel de Administración</h1>
        <MangaDataLoader />
      </main>
    </Suspense>
  );
}
