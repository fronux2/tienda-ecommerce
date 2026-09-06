import type { Categoria, Manga, Serie } from '@/types/supabase'

/**
 * Fixtures tipadas para los tests.
 *
 * Cada factory devuelve el objeto completo y acepta overrides parciales, asi
 * los tests declaran solo lo que les importa sin renunciar al tipado. Antes se
 * escribian objetos a mano tipo { id, nombre } que no satisfacian el tipo, y el
 * chequeo de tipos quedaba en decorativo.
 *
 * Vive fuera de __tests__ a proposito: Jest trata cualquier archivo dentro de
 * esa carpeta como suite y fallaria por no contener tests.
 */

export const crearCategoria = (over: Partial<Categoria> = {}): Categoria => ({
  id: 'cat-1',
  nombre: 'Shonen',
  descripcion: 'Manga dirigido a publico joven',
  ...over,
})

export const crearSerie = (over: Partial<Serie> = {}): Serie => ({
  id: 'ser-1',
  nombre: 'One Piece',
  descripcion: 'Las aventuras de Monkey D. Luffy',
  autor: 'Eiichiro Oda',
  estado: 'en_curso',
  imagen_serie: 'https://img.test/one-piece.jpg',
  ...over,
})

export const crearManga = (over: Partial<Manga> = {}): Manga => ({
  id: 'm-1',
  titulo: 'Naruto',
  autor: 'Masashi Kishimoto',
  editorial: 'Shueisha',
  categoria_id: 'cat-1',
  serie_id: 'ser-1',
  volumen: 1,
  descripcion: 'Primer tomo',
  precio: 9900,
  stock: 15,
  imagen_portada: 'https://img.test/naruto.jpg',
  isbn: '1234567890',
  numero_paginas: 200,
  idioma: 'Japones',
  fecha_publicacion: '2023-01-01',
  estado: 'nuevo',
  activo: true,
  es_popular: true,
  ...over,
})
