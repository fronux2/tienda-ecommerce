import { getCategorias } from "@/lib/supabase/services/categorias.server";
import CategoriaTable from "@/components/CategoriaTable";
export default async function CategoriasPage() {
    const categorias = await getCategorias();
    console.log('Categorias:', categorias);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="mb-2 text-gray-700">Lista de Categorias</p>

      <CategoriaTable categorias={categorias} />
    </div>
  );  
}