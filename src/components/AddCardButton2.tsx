"use client"
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import { getMangaById } from '@/lib/supabase/services/mangas.client';

export default function AddCardButton2({ mangaId, userId }: { mangaId: string; userId: string }) {
  const [manga, setManga] = useState<NuevoManga | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, loading: cartLoading, syncCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    
    const fetchManga = async () => {
      setIsLoading(true);
      try {
        const data = await getMangaById(mangaId);
        if (isMounted && data.length > 0) {
          setManga(data[0]);
        }
      } catch (error) {
        console.error("Error loading manga:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (userId && mangaId) {
      fetchManga();
    }

    return () => {
      isMounted = false;
    };
  }, [mangaId, userId]);

  if (!userId) return null;

  const handleAddToCart = async () => {
    if (!manga || !userId) return;
    
    await addToCart({
      usuario_id: userId,
      manga_id: mangaId,
      cantidad: 1,
      mangas: manga
    });

    // Sincronizar después de agregar
    await syncCart(userId);
  };

  return (
    <button
      onClick={handleAddToCart}
      type="button"
      disabled={isLoading || cartLoading || !manga}
      className={`bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition-colors duration-300 ${
        isLoading || cartLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label={isLoading ? "Cargando..." : "Añadir al carrito"}
    >
      {isLoading || cartLoading ? (
        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        'Añadir al Carrito'
      )}
    </button>
  );
}