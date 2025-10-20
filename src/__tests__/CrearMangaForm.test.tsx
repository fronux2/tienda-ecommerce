import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CrearMangaForm from '@/components/forms/CrearMangaForm';
import { createClient } from '@/utils/supabase/client';
import { getCategoriasClient } from '@/lib/supabase/services/categorias.client';
import { getSeriesClient } from '@/lib/supabase/services/series.client';
import { crearManga } from '@/lib/supabase/services/mangas.client';

// Mock completo de las dependencias
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
  const mockCategorias = [
    { id: 1, nombre: 'Shonen' },
    { id: 2, nombre: 'Seinen' },
  ];

  const mockSeries = [
    { id: 1, nombre: 'One Piece' },
    { id: 2, nombre: 'Berserk' },
  ];

  const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
  const mockPublicUrl = 'https://example.com/image.jpg';

  beforeEach(() => {
    // Configurar mocks con implementaciones
    (getCategoriasClient as jest.Mock).mockResolvedValue(mockCategorias);
    (getSeriesClient as jest.Mock).mockResolvedValue(mockSeries);
    (crearManga as jest.Mock).mockResolvedValue({ error: null });

    // Mock de Supabase storage
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
      expect(screen.getByLabelText('Imagen Portada (URL):')).toBeInTheDocument();
      expect(screen.getByText('Crear')).toBeInTheDocument();
    });
  });

  it('debe mostrar errores de validación cuando se envía el formulario vacío', async () => {
    render(<CrearMangaForm />);
    
    const submitButton = screen.getByText('Crear');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Este campo es obligatorio').length).toBeGreaterThan(0);
    });
  });

  it('debe enviar el formulario correctamente con datos válidos', async () => {
    render(<CrearMangaForm />);
    
    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
    });

    // Rellenar el formulario
    await userEvent.type(screen.getByLabelText('Nombre:'), 'Naruto Vol.1');
    await userEvent.type(screen.getByLabelText('Autor:'), 'Masashi Kishimoto');
    await userEvent.type(screen.getByLabelText('Editorial:'), 'Shueisha');
    await userEvent.selectOptions(screen.getByLabelText('Categoría:'), '1');
    await userEvent.selectOptions(screen.getByLabelText('Serie:'), '1');
    await userEvent.type(screen.getByLabelText('Volumen:'), '1');
    await userEvent.type(screen.getByLabelText('Descripción:'), 'Primer volumen de Naruto');
    await userEvent.type(screen.getByLabelText('Precio:'), '10.99');
    await userEvent.type(screen.getByLabelText('Stock:'), '50');
    
    // Simular carga de archivo
    const fileInput = screen.getByLabelText('Imagen Portada (URL):');
    await userEvent.upload(fileInput, mockFile);

    await userEvent.type(screen.getByLabelText('ISBN:'), '1234567890');
    await userEvent.type(screen.getByLabelText('Número de páginas:'), '200');
    await userEvent.type(screen.getByLabelText('Idioma:'), 'Japonés');
    await userEvent.type(screen.getByLabelText('Fecha de publicación:'), '2023-01-01');
    await userEvent.selectOptions(screen.getByLabelText('Estado:'), 'nuevo');
    await userEvent.click(screen.getByLabelText('Activo'));
    await userEvent.selectOptions(screen.getByLabelText('Es popular:'), 'true');

    // Enviar formulario
    await userEvent.click(screen.getByText('Crear'));

    await waitFor(() => {
      expect(crearManga).toHaveBeenCalledWith(expect.objectContaining({
        titulo: 'Naruto Vol.1',
        autor: 'Masashi Kishimoto',
        editorial: 'Shueisha',
        categoria_id: 1,
        serie_id: 1,
        volumen: 1,
        descripcion: 'Primer volumen de Naruto',
        precio: 10.99,
        stock: 50,
        imagen_portada: mockPublicUrl,
        isbn: '1234567890',
        numero_paginas: 200,
        idioma: 'Japonés',
        fecha_publicacion: '2023-01-01',
        estado: 'nuevo',
        activo: true,
        es_popular: 'true',
      }));
    }, { timeout: 5000 });
  });

  it('debe manejar errores al subir la imagen', async () => {
    // Mock de error al subir imagen
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
      expect(screen.getByLabelText('Nombre:')).toBeInTheDocument();
    });

    // Rellenar datos mínimos
    await userEvent.type(screen.getByLabelText('Nombre:'), 'Naruto Vol.1');
    await userEvent.type(screen.getByLabelText('Autor:'), 'Masashi Kishimoto');
    await userEvent.selectOptions(screen.getByLabelText('Categoría:'), '1');
    await userEvent.selectOptions(screen.getByLabelText('Serie:'), '1');
    await userEvent.type(screen.getByLabelText('Volumen:'), '1');
    await userEvent.type(screen.getByLabelText('Precio:'), '10.99');
    await userEvent.type(screen.getByLabelText('Stock:'), '50');
    
    // Simular carga de archivo
    const fileInput = screen.getByLabelText('Imagen Portada (URL):');
    await userEvent.upload(fileInput, mockFile);

    // Enviar formulario
    await userEvent.click(screen.getByText('Crear'));

    // Verificar que no se llamó a crearManga
    await waitFor(() => {
      expect(crearManga).not.toHaveBeenCalled();
    });
  });

  it('debe manejar errores al cargar categorías y series', async () => {
    // Mock de error al cargar datos
    (getCategoriasClient as jest.Mock).mockRejectedValue(new Error('Error al cargar categorías'));
    (getSeriesClient as jest.Mock).mockRejectedValue(new Error('Error al cargar series'));

    render(<CrearMangaForm />);
    
    // Verificar que los select están vacíos
    await waitFor(() => {
      expect(screen.getByLabelText('Categoría:').querySelectorAll('option').length).toBe(0);
      expect(screen.getByLabelText('Serie:').querySelectorAll('option').length).toBe(0);
    });
  });
});