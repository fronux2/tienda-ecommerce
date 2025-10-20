import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CrearMangaForm from "@/components/forms/CrearMangaForm";
import { getCategoriasClient } from "@/lib/supabase/services/categorias.client";
import { getSeriesClient }  from "@/lib/supabase/services/series.client";
import { createClient } from "@/utils/supabase/client";
import { crearManga } from "@/lib/supabase/services/mangas.client";

jest.mock("@/lib/supabase/services/categorias.client");
jest.mock("@/lib/supabase/services/series.client");
jest.mock("@/utils/supabase/client");
jest.mock("@/lib/supabase/services/mangas.client");

describe("CrearMangaForm", () => {
  let mockUpload;
  let mockGetPublicUrl;

  beforeEach(() => {
    jest.clearAllMocks();

    (getCategoriasClient as jest.Mock).mockResolvedValue([
      { id: "1", nombre: "Acción" },
    ]);
    (getSeriesClient as jest.Mock).mockResolvedValue([
      { id: "10", nombre: "Naruto" },
    ]);

    mockUpload = jest.fn().mockResolvedValue({ data: { path: "fake/path" }, error: null });
    mockGetPublicUrl = jest.fn().mockReturnValue({
      data: { publicUrl: "https://fakeurl.com/image.jpg" },
    });

    (createClient as jest.Mock).mockReturnValue({
      storage: {
        from: () => ({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        }),
      },
    });
  });

  it("envía el formulario correctamente con datos válidos", async () => {
    const user = userEvent.setup();
    (crearManga as jest.Mock).mockResolvedValue({});

    render(<CrearMangaForm />);

    // Llenar los campos de texto
    await user.type(screen.getByLabelText(/Nombre/i), "One Piece");
    await user.type(screen.getByLabelText(/Autor/i), "Eiichiro Oda");
    await user.type(screen.getByLabelText(/Editorial/i), "Shueisha");
    await user.selectOptions(screen.getByLabelText(/Categoría/i), "1");
    await user.selectOptions(screen.getByLabelText(/Serie/i), "10");
    await user.type(screen.getByLabelText(/Volumen/i), "1");
    await user.type(screen.getByLabelText(/Descripción/i), "Manga de aventuras");
    await user.type(screen.getByLabelText(/Precio/i), "1000");
    await user.type(screen.getByLabelText(/Stock/i), "10");
    await user.type(screen.getByLabelText(/ISBN/i), "978-4-08-880313-5");
    await user.type(screen.getByLabelText(/Número de páginas/i), "200");
    await user.type(screen.getByLabelText(/Idioma/i), "Japonés");
    await user.type(screen.getByLabelText(/Fecha de publicación/i), "1997-07-22");
    await user.selectOptions(screen.getByLabelText(/Estado/i), "nuevo");
    await user.click(screen.getByLabelText(/Activo/i));
    await user.selectOptions(screen.getByLabelText(/Es popular/i), "true");

    // Simular la subida del archivo
    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    const fileInput = screen.getByLabelText(/Imagen Portada/i);
    await user.upload(fileInput, file);

    // Esperar a que el mock de Supabase.storage.upload sea llamado
    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining("cover.jpg"),
        file,
        {
          cacheControl: "3600",
          upsert: false,
        }
      );
    });

    // Enviar el formulario
    const submitButton = screen.getByRole("button", { name: /Crear/i });
    await user.click(submitButton);

    // Esperar a que `crearManga` sea llamado con la URL de la imagen mockeada
    await waitFor(() => {
      expect(crearManga).toHaveBeenCalledWith(
        expect.objectContaining({
          titulo: "One Piece",
          imagen_portada: "https://fakeurl.com/image.jpg",
          autor: "Eiichiro Oda",
        })
      );
    });
  });
});