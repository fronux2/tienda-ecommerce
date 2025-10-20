import CrearMangaForm from "@/components/forms/CrearMangaForm";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Admin</h1>
      <CrearMangaForm />
    </main>
  );
}
