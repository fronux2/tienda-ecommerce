import UploadForm from '@/components/UploadImgForm';

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Subir imagen de manga</h1>
      <UploadForm />
    </main>
  );
}