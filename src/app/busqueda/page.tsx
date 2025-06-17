'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useDebounce from '@/hooks/useDebounce';

type Manga = {
  id: string;
  titulo: string;
  imagen_portada?: string;
};

export default function SearchBar() {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Manga[]>([]);
  const [cargando, setCargando] = useState(false);
  const debouncedBusqueda = useDebounce(busqueda);
  const supabase = createClient();

  useEffect(() => {
    const buscar = async () => {
      if (debouncedBusqueda.trim() === '') {
        setResultados([]);
        return;
      }

      setCargando(true);
      const { data, error } = await supabase
        .from('mangas')
        .select('id, titulo, imagen_portada')
        .ilike('titulo', `%${debouncedBusqueda}%`)
        .limit(10);

      if (error) {
        console.error('Error al buscar:', error.message);
        setResultados([]);
      } else {
        setResultados(data || []);
      }

      setCargando(false);
    };

    buscar();
  }, [debouncedBusqueda]);

  return (
    <div className="relative max-w-md mx-auto mt-6">
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar mangas..."
        className="w-full p-2 border rounded shadow"
      />

      {cargando && (
        <div className="absolute top-full left-0 mt-1 bg-white p-2 text-sm">
          Cargando...
        </div>
      )}

      {resultados.length > 0 && busqueda.trim() !== '' && (
        <ul className="absolute w-full bg-white border mt-1 rounded shadow z-10 max-h-60 overflow-y-auto">
          {resultados.map((manga) => (
            <li key={manga.id} className="p-2 hover:bg-gray-200 cursor-pointer">
              <div className="flex items-center gap-2">
                {manga.imagen_portada && (
                  <img
                    src={manga.imagen_portada}
                    alt={manga.titulo}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span>{manga.titulo}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!cargando && busqueda.trim() !== '' && resultados.length === 0 && (
        <div className="absolute top-full left-0 mt-1 bg-white p-2 text-sm text-gray-500">
          Sin resultados.
        </div>
      )}
    </div>
  );
}
