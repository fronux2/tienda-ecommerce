export type Rol = {
  id: number
  nombre: string
}

export type Usuario = {
  id: string
  email: string | null
  rol_id: number
}

export type Categoria = {
  id: string
  nombre: string
}

export type Serie = {
  id: string
  nombre: string
}

export type Manga = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen_url: string
  categoria_id: string
  categoria?: Categoria
  serie_id?: string
  serie?: Serie
}

export type Pedido = {
  id: string
  user_id: string
  fecha: string
  total: number
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
