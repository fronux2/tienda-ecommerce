"use client"
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { formatPrice } from "@/lib/formatPrice";

type CardProps = {
  id: string;
  imagen: string;
  titulo: string;
  autor: string;
  editorial: string;
  precio: number;
  userId: string | null;
  es_popular?: boolean;
};

export default function MangaCard({ id, imagen, titulo, autor, editorial, precio, userId, es_popular }: CardProps) {
  return (
    <div className="bg-cream rounded-xl shadow-lg overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 w-64">
      <Link href={`/mangas/${id}`} className="block">
        <div className="relative h-72 w-full bg-surface flex items-center justify-center">
          <Image
            src={imagen}
            alt={titulo}
            width={400}
            height={560}
            className="w-40 h-56 object-contain transition-transform duration-500 hover:scale-105"
          />
          {es_popular && (
            <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-lg text-xs font-bold">
              POPULAR
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/mangas/${id}`}>
          <h3 className="text-lg font-bold text-ink mb-2 hover:text-primary transition-colors line-clamp-2 h-14">
            {titulo}
          </h3>
        </Link>

        <div className="space-y-1 mb-3">
          <p className="text-sm text-text flex items-start">
            <span className="font-semibold text-ink min-w-17.5">Autor:</span>
            <span className="flex-1">{autor}</span>
          </p>
          <p className="text-sm text-text flex items-start">
            <span className="font-semibold text-ink min-w-17.5">Editorial:</span>
            <span className="flex-1">{editorial}</span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-xl font-bold text-primary">{formatPrice(precio)}</p>
          <AddToCartButton mangaId={id} userId={userId} />
        </div>
      </div>
    </div>
  );
}
