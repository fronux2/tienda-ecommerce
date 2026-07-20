import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CrearMangaForm from '@/components/forms/CrearMangaForm';
import { createClient } from '@/utils/supabase/client';
import { getCategoriasClient } from '@/lib/supabase/services/categorias.client';
import { getSeriesClient } from '@/lib/supabase/services/series.client';
import { crearManga } from '@/lib/supabase/services/mangas.client';

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  })),
}));

jest.mock('@/lib/supabase/services/categorias.client', () => ({
  getCategoriasClient: jest.fn(),
}));

jest.mock('@/lib/supabase/services/series.client', () => ({
  getSeriesClient: jest.fn(),
}));

jest.mock('@/lib/supabase/services/mangas.client', () => ({
  crearManga: jest.fn(),
}));

describe('CrearMangaForm', () => {
  const CAT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const SERIE_ID = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

  const mockCategorias = [
    { id: CAT_ID, nombre: 'Shonen' },
    { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', nombre: 'Seinen' },
  ];

  const mockSeries = [
    { id: SERIE_ID, nombre: 'One Piece' },
    { id: 'd4e5f6a7-b8c9-0123-defa-234567890123', nombre: 'Berserk' },
  ];

  const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
  const mockPublicUrl = 'https://example.com/image.jpg';

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    (getCategoriasClient as jest.Mock).mockResolvedValue(mockCategorias);
    (getSeriesClient as jest.Mock).mockResolvedValue(mockSeries);
    (crearManga as jest.Mock).mockResolvedValue({ error: null });

    (createClient as jest.Mock).mockImplementation(() => ({
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn().mockResolvedValue({ error: null }),
          getPublicUrl: jest.fn().mockReturnValue({
            data: { publicUrl: mockPublicUrl }
          }),
        })),
      },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar correctamente', async () => {
    render(<CrearMangaForm />);

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
      expect(screen.getByLabelText('Autor:')).toBeInTheDocument();
      expect(screen.getByLabelText('Categoría:')).toBeInTheDocument();
      expect(screen.getByLabelText('Serie:')).toBeInTheDocument();
      expect(screen.getByLabelText('Imagen Portada:')).toBeInTheDocument();
      expect(screen.getByText('Crear')).toBeInTheDocument();
    });
  });

  it('debe mostrar errores de validación cuando se envía el formulario vacío', async () => {
    render(<CrearMangaForm />);

    const submitButton = screen.getByText('Crear');
    await user.click(submitButton);

    await waitFor(() => {
      const errors = document.querySelectorAll('span.text-red-500');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('debe enviar el formulario correctamente con datos válidos', async () => {
    render(<CrearMangaForm />);

    await waitFor(() => {
      expect(screen.getByLabelText('Categoría:').querySelectorAll('option').length).toBeGreaterThan(1);
    });

    fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: 'Naruto Vol.1' } });
    fireEvent.change(screen.getByLabelText('Autor:'), { target: { value: 'Masashi Kishimoto' } });
    fireEvent.change(screen.getByLabelText('Editorial:'), { target: { value: 'Shueisha' } });
    await user.selectOptions(screen.getByLabelText('Categoría:'), CAT_ID);
    await user.selectOptions(screen.getByLabelText('Serie:'), SERIE_ID);
    fireEvent.change(screen.getByLabelText('Volumen:'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Descripción:'), { target: { value: 'Primer volumen de Naruto' } });
    fireEvent.change(screen.getByLabelText('Precio:'), { target: { value: '10990' } });
    fireEvent.change(screen.getByLabelText('Stock:'), { target: { value: '50' } });

    const fileInput = screen.getByLabelText('Imagen Portada:');
    await user.upload(fileInput, mockFile);

    fireEvent.change(screen.getByLabelText('ISBN:'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Número de páginas:'), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText('Idioma:'), { target: { value: 'Japonés' } });
    fireEvent.change(screen.getByLabelText('Fecha de publicación:'), { target: { value: '2023-01-01' } });
    await user.selectOptions(screen.getByLabelText('Estado:'), 'nuevo');
    await user.click(screen.getByLabelText('Activo'));
    await user.selectOptions(screen.getByLabelText('Es popular (opcional):'), 'true');

    await user.click(screen.getByText('Crear'));

    await waitFor(() => {
      expect(crearManga).toHaveBeenCalledWith(expect.objectContaining({
        titulo: 'Naruto Vol.1',
        autor: 'Masashi Kishimoto',
        editorial: 'Shueisha',
        categoria_id: CAT_ID,
        serie_id: SERIE_ID,
        volumen: 1,
        descripcion: 'Primer volumen de Naruto',
        precio: 10990,
        stock: 50,
        imagen_portada: mockPublicUrl,
        isbn: '1234567890',
        numero_paginas: 200,
        idioma: 'Japonés',
        fecha_publicacion: '2023-01-01',
        estado: 'nuevo',
        activo: true,
        es_popular: true,
      }));
    });
  });

  it('debe manejar errores al subir la imagen', async () => {
    (createClient as jest.Mock).mockImplementation(() => ({
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn().mockResolvedValue({
            error: { message: 'Error al subir imagen' }
          }),
          getPublicUrl: jest.fn(),
        })),
      },
    }));

    render(<CrearMangaForm />);

    await waitFor(() => {
      expect(screen.getByLabelText('Categoría:').querySelectorAll('option').length).toBeGreaterThan(1);
    });

    fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: 'Naruto Vol.1' } });
    fireEvent.change(screen.getByLabelText('Autor:'), { target: { value: 'Masashi Kishimoto' } });
    fireEvent.change(screen.getByLabelText('Editorial:'), { target: { value: 'Shueisha' } });
    await user.selectOptions(screen.getByLabelText('Categoría:'), CAT_ID);
    await user.selectOptions(screen.getByLabelText('Serie:'), SERIE_ID);
    fireEvent.change(screen.getByLabelText('Volumen:'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Descripción:'), { target: { value: 'Primer volumen de Naruto' } });
    fireEvent.change(screen.getByLabelText('Precio:'), { target: { value: '10990' } });
    fireEvent.change(screen.getByLabelText('Stock:'), { target: { value: '50' } });

    const fileInput = screen.getByLabelText('Imagen Portada:');
    await user.upload(fileInput, mockFile);

    fireEvent.change(screen.getByLabelText('ISBN:'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Número de páginas:'), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText('Idioma:'), { target: { value: 'Japonés' } });
    fireEvent.change(screen.getByLabelText('Fecha de publicación:'), { target: { value: '2023-01-01' } });
    await user.selectOptions(screen.getByLabelText('Estado:'), 'nuevo');
    await user.click(screen.getByLabelText('Activo'));
    await user.click(screen.getByText('Crear'));

    await waitFor(() => {
      expect(crearManga).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al cargar categorías y series', async () => {
    (getCategoriasClient as jest.Mock).mockRejectedValue(new Error('Error al cargar categorías'));
    (getSeriesClient as jest.Mock).mockRejectedValue(new Error('Error al cargar series'));

    render(<CrearMangaForm />);

    await waitFor(() => {
      expect(screen.getByLabelText('Categoría:').querySelectorAll('option').length).toBe(1);
      expect(screen.getByLabelText('Serie:').querySelectorAll('option').length).toBe(1);
    });
  });
});
