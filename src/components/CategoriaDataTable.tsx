import { getCategorias } from "@/lib/supabase/services/categorias.server";
import CategoriaTable from "@/components/CategoriaTable";
export default async function CategoriaDataTable() {
  const categorias = await getCategorias();
  return (
    <div className="p-4">
      <CategoriaTable categorias={categorias} />
    </div>
  );  
}