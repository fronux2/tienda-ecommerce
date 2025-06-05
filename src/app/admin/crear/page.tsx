// app/admin/crear/page.tsx
import CrearCategoriaForm from '@/components/forms/CrearCategoriaForm'
import CrearSerieForm from '@/components/forms/CrearSerieForm'
import CrearMangaForm from '@/components/forms/CrearMangaForm';



export default function CrearPage() {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">Panel de creación</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Crear Categoría</h2>
          <CrearCategoriaForm />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Crear Serie</h2>
          <CrearSerieForm />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Crear Manga</h2>
          <CrearMangaForm />
        </section>
      </div>
    </div>
  )
}
