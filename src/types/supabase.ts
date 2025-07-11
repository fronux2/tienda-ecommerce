export type Roles = {
  id: number
  nombre: string
}

export type Rol = {
  id: string
  nombre: string
}

export type Usuario = {
  id: string
  email: string
  roles: Roles[]
}

export type NuevoUsuario = {
  email: string
  password: string
}

export type Categoria = {
  id: string
  nombre: string
}

export type Serie = {
  id: string
  nombre: string
  descripcion: string
  autor: string
  estado: string
  imagen_serie: string  
}

export type NuevaSerie = {
  nombre: string
  descripcion: string
  autor: string
  estado: string
  imagen_serie: string  
}



export type Manga = {
  id: string
  titulo: string
  autor: string
  editorial: string
  categoria_id: string  
  categorias?: Categoria
  serie_id: string
  series?: Serie
  volumen: string
  descripcion: string
  precio: number
  stock: number
  imagen_portada: string
  isbn: string
  numero_paginas: number
  idioma: string
  fecha_publicacion: string
  estado: string
  activo: boolean
  fecha_creacion?: string
  es_popular?: boolean
}

export type NuevoManga = {
  titulo: string
  autor: string
  editorial: string
  categoria_id: string
  serie_id: string
  volumen: number
  descripcion: string
  precio: number
  stock: number
  imagen_portada: string
  isbn: string
  numero_paginas: number
  idioma: string
  fecha_publicacion: string
  estado: string
  activo: boolean
  fecha_creacion?: string
  es_popular?: boolean
}

export type UpdateManga = {
  id?: string | undefined
  titulo?: string
  autor?: string
  editorial?: string
  categoria_id?: string
  serie_id?: string
  volumen?: number
  descripcion?: string
  precio?: number
  stock?: number
  imagen_portada?: string
  isbn?: string
  numero_paginas?: number
  idioma?: string
  fecha_publicacion?: string
  estado?: string
  activo?: boolean
  fecha_creacion?: string
  es_popular?: boolean
}

export type Pedido = {
  id: string
  usuario_id: string
  direccion_id: string
  total: number
  estado: string
  metodo_pago: string
  notas_pedido: string
  fecha_pedido: string
  fecha_actualizacion: string
}

export type DetallePedido = {
  id: string
  pedido_id: string
  manga_id: string
  cantidad: number
  precio_unitario: number
  manga?: Manga
}

export type CarritoItem = {
  id: string
  user_id: string
  manga_id: string
  cantidad: number
  manga?: Manga
}
