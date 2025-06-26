import { getMangas } from "@/lib/supabase/services/mangas.server";
import { Manga } from "@/types/supabase";
import ListMangas from "@/components/ListMangas";
import { createClient } from "@/utils/supabase/server";
export default async function MangasPage() {
  const supabase = await createClient()
  const data: Manga[] = await getMangas();
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mangas</h1>
      <ListMangas mangas={data} userId={user?.id || ''} />
    </div>
  );
}
