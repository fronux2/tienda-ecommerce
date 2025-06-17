import { getMangas } from "@/lib/supabase/services/mangas.server";
import { Manga } from "@/types/supabase";
import ListMangas from "@/components/ListMangas";

export default async function MangasPage() {
  const data: Manga[] = await getMangas();
  console.log(data);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mangas</h1>
      <ListMangas mangas={data} />
    </div>
  );
}
